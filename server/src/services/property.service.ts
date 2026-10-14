import { randomBytes } from 'node:crypto';
import { Prisma, PropertyStatus } from '@prisma/client';
import { prisma } from '../config/prisma';
import { deleteImage } from './cloudinary.service';
import type { PropertyInput } from '../types/property';
import type { PropertyQuery } from '../types/property';
import { AppError } from '../utils/http';

export const propertyInclude = {
  images: { orderBy: { position: 'asc' as const } },
  agent: { select: { id: true, name: true, phone: true, avatarUrl: true } },
};

export async function listProperties(
  query: PropertyQuery,
  opts: { agentId?: string; includeUnapproved?: boolean } = {},
) {
  const where: Prisma.PropertyWhereInput = {
    ...(opts.agentId
      ? { agentId: opts.agentId, ...(query.status ? { status: query.status } : {}) }
      : opts.includeUnapproved
        ? query.status
          ? { status: query.status }
          : {}
        : { status: PropertyStatus.APPROVED }),
    ...(query.type ? { type: query.type } : {}),
    ...(query.category ? { category: query.category } : {}),
    ...(query.bedrooms !== undefined ? { bedrooms: { gte: query.bedrooms } } : {}),
    ...(query.minPrice !== undefined || query.maxPrice !== undefined
      ? {
          price: {
            ...(query.minPrice !== undefined ? { gte: query.minPrice } : {}),
            ...(query.maxPrice !== undefined ? { lte: query.maxPrice } : {}),
          },
        }
      : {}),
    ...(query.city ? { city: { contains: query.city, mode: 'insensitive' } } : {}),
    ...(query.state ? { state: { contains: query.state, mode: 'insensitive' } } : {}),
    ...(query.location || query.q
      ? {
          AND: [
            ...(query.location
              ? [
                  {
                    OR: [
                      { city: { contains: query.location, mode: 'insensitive' as const } },
                      { state: { contains: query.location, mode: 'insensitive' as const } },
                      { address: { contains: query.location, mode: 'insensitive' as const } },
                    ],
                  },
                ]
              : []),
            ...(query.q
              ? [
                  {
                    OR: [
                      { title: { contains: query.q, mode: 'insensitive' as const } },
                      { description: { contains: query.q, mode: 'insensitive' as const } },
                      { city: { contains: query.q, mode: 'insensitive' as const } },
                      { state: { contains: query.q, mode: 'insensitive' as const } },
                    ],
                  },
                ]
              : []),
          ],
        }
      : {}),
  };
  const orderBy: Prisma.PropertyOrderByWithRelationInput = {
    ...(query.sort === 'oldest' ? { createdAt: 'asc' } : {}),
    ...(query.sort === 'newest' ? { createdAt: 'desc' } : {}),
    ...(query.sort === 'price_asc' ? { price: 'asc' } : {}),
    ...(query.sort === 'price_desc' ? { price: 'desc' } : {}),
  };
  const [data, total] = await prisma.$transaction([
    prisma.property.findMany({
      where,
      include: propertyInclude,
      orderBy,
      skip: (query.page - 1) * query.limit,
      take: query.limit,
    }),
    prisma.property.count({ where }),
  ]);
  return { data, total };
}

export async function createProperty(input: PropertyInput, agentId: string) {
  return prisma.property.create({
    data: {
      slug: `${input.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')}-${randomBytes(3).toString('hex')}`,
      ...input,
      status: PropertyStatus.PENDING,
      agentId,
      images: { create: (input.images ?? []).map((image, position) => ({ ...image, position })) },
    },
    include: propertyInclude,
  });
}

export async function updateProperty(id: string, input: PropertyInput, user: { id: string; role: string }) {
  const current = await prisma.property.findUnique({ where: { id }, include: { images: true } });
  if (!current) throw new AppError('Property not found.', 404, 'NOT_FOUND');
  if (user.role !== 'ADMIN' && current.agentId !== user.id)
    throw new AppError('You can only edit your own listings.', 403, 'FORBIDDEN');
  const updated = await prisma.$transaction(async (tx) => {
    await tx.property.update({
      where: { id },
      data: {
        title: input.title,
        description: input.description,
        price: input.price,
        type: input.type,
        category: input.category,
        bedrooms: input.bedrooms ?? null,
        bathrooms: input.bathrooms ?? null,
        area: input.area,
        address: input.address,
        city: input.city,
        state: input.state,
        lat: input.lat ?? null,
        lng: input.lng ?? null,
        features: input.features,
        ...(user.role === 'ADMIN' ? {} : { status: PropertyStatus.PENDING }),
      },
    });
    if (input.images !== undefined) {
      await tx.propertyImage.deleteMany({ where: { propertyId: id } });
      if (input.images.length)
        await tx.propertyImage.createMany({
          data: input.images.map((image, position) => ({ ...image, position, propertyId: id })),
        });
    }
    return tx.property.findUniqueOrThrow({ where: { id }, include: propertyInclude });
  });
  if (input.images !== undefined) {
    const retained = new Set(input.images.map((image) => image.publicId));
    await Promise.allSettled(
      current.images
        .filter((image) => !retained.has(image.publicId) && !image.publicId.startsWith('seed/'))
        .map((image) => deleteImage(image.publicId)),
    );
  }
  return updated;
}

export async function getProperty(id: string, user?: { id: string; role: string }) {
  const property = await prisma.property.findUnique({ where: { id }, include: propertyInclude });
  if (!property) throw new AppError('Property not found.', 404, 'NOT_FOUND');
  const canView =
    property.status === PropertyStatus.APPROVED || user?.role === 'ADMIN' || user?.id === property.agentId;
  if (!canView) throw new AppError('Property not found.', 404, 'NOT_FOUND');
  return property;
}
