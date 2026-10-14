import type { RequestHandler } from 'express';
import { PropertyStatus } from '@prisma/client';
import { prisma } from '../config/prisma';
import { AppError, sendData } from '../utils/http';

export const list: RequestHandler = async (req, res) => {
  const favorites = await prisma.favorite.findMany({
    where: { userId: req.user!.id, property: { status: PropertyStatus.APPROVED } },
    include: {
      property: {
        include: { images: { orderBy: { position: 'asc' } }, agent: { select: { id: true, name: true } } },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
  return sendData(
    res,
    favorites.map((favorite) => favorite.property),
  );
};

export const add: RequestHandler = async (req, res) => {
  const property = await prisma.property.findFirst({
    where: { id: String(req.params.propertyId), status: PropertyStatus.APPROVED },
  });
  if (!property) throw new AppError('Property not found.', 404, 'NOT_FOUND');
  await prisma.favorite.upsert({
    where: { userId_propertyId: { userId: req.user!.id, propertyId: property.id } },
    create: { userId: req.user!.id, propertyId: property.id },
    update: {},
  });
  return sendData(res, { propertyId: property.id, isFavorite: true }, 201);
};

export const remove: RequestHandler = async (req, res) => {
  await prisma.favorite.deleteMany({
    where: { userId: req.user!.id, propertyId: String(req.params.propertyId) },
  });
  return sendData(res, { propertyId: String(req.params.propertyId), isFavorite: false });
};
