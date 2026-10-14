import type { RequestHandler } from 'express';
import { PropertyStatus } from '@prisma/client';
import { prisma } from '../config/prisma';
import { deleteImage } from '../services/cloudinary.service';
import { createProperty, getProperty, listProperties, updateProperty } from '../services/property.service';
import { propertyQuerySchema } from '../validators/property';
import { AppError, sendData, sendPage } from '../utils/http';

export const list: RequestHandler = async (req, res) => {
  const query = propertyQuerySchema.parse(req.query);
  const result = await listProperties(query);
  return sendPage(res, result.data, query.page, query.limit, result.total);
};

export const insights: RequestHandler = async (_req, res) => {
  const where = { status: PropertyStatus.APPROVED };
  const [homes, markets, lowestPrice, forRent] = await Promise.all([
    prisma.property.count({ where }),
    prisma.property.findMany({ where, distinct: ['state'], select: { state: true } }),
    prisma.property.aggregate({ where, _min: { price: true } }),
    prisma.property.count({ where: { ...where, type: 'RENT' } }),
  ]);
  return sendData(res, {
    homes,
    markets: markets.length,
    lowestPrice: lowestPrice._min.price?.toString() ?? null,
    forRent,
  });
};

export const mine: RequestHandler = async (req, res) => {
  const query = propertyQuerySchema.parse(req.query);
  const result = await listProperties(query, { agentId: req.user!.id });
  return sendPage(res, result.data, query.page, query.limit, result.total);
};

export const detail: RequestHandler = async (req, res) =>
  sendData(res, await getProperty(String(req.params.id), req.user));

export const create: RequestHandler = async (req, res) => {
  return sendData(res, await createProperty(req.body, req.user!.id), 201);
};

export const update: RequestHandler = async (req, res) => {
  return sendData(res, await updateProperty(String(req.params.id), req.body, req.user!));
};

export const remove: RequestHandler = async (req, res) => {
  const property = await prisma.property.findUnique({
    where: { id: String(req.params.id) },
    include: { images: true },
  });
  if (!property) throw new AppError('Property not found.', 404, 'NOT_FOUND');
  if (req.user!.role !== 'ADMIN' && property.agentId !== req.user!.id)
    throw new AppError('You can only remove your own listings.', 403, 'FORBIDDEN');
  await prisma.property.delete({ where: { id: property.id } });
  await Promise.allSettled(
    property.images
      .filter((image) => !image.publicId.startsWith('seed/'))
      .map((image) => deleteImage(image.publicId)),
  );
  return sendData(res, { message: 'Listing removed.' });
};

export const related: RequestHandler = async (req, res) => {
  const current = await prisma.property.findUnique({ where: { id: String(req.params.id) } });
  if (!current || current.status !== PropertyStatus.APPROVED)
    throw new AppError('Property not found.', 404, 'NOT_FOUND');
  const data = await prisma.property.findMany({
    where: {
      status: PropertyStatus.APPROVED,
      id: { not: current.id },
      OR: [{ city: current.city }, { state: current.state }],
    },
    include: { images: { orderBy: { position: 'asc' } }, agent: { select: { id: true, name: true } } },
    take: 3,
    orderBy: { createdAt: 'desc' },
  });
  return sendData(res, data);
};
