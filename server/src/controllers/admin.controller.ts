import type { RequestHandler } from 'express';
import { PropertyStatus, Role } from '@prisma/client';
import { prisma } from '../config/prisma';
import { listProperties } from '../services/property.service';
import { moderationSchema } from '../validators/property';
import { propertyQuerySchema } from '../validators/property';
import { AppError, sendData, sendPage } from '../utils/http';

export const properties: RequestHandler = async (req, res) => {
  const query = propertyQuerySchema.parse(req.query);
  const result = await listProperties(query, { includeUnapproved: true });
  return sendPage(res, result.data, query.page, query.limit, result.total);
};

export const moderateProperty: RequestHandler = async (req, res) => {
  const { status } = moderationSchema.parse(req.body);
  const property = await prisma.property.update({
    where: { id: String(req.params.id) },
    data: { status },
    include: { images: true },
  });
  return sendData(res, property);
};

export const users: RequestHandler = async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 20));
  const q = typeof req.query.q === 'string' ? req.query.q.trim() : '';
  const where = q
    ? {
        OR: [
          { name: { contains: q, mode: 'insensitive' as const } },
          { email: { contains: q, mode: 'insensitive' as const } },
        ],
      }
    : {};
  const [data, total] = await prisma.$transaction([
    prisma.user.findMany({
      where,
      select: { id: true, name: true, email: true, role: true, isActive: true, createdAt: true },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.user.count({ where }),
  ]);
  return sendPage(res, data, page, limit, total);
};

export const updateUser: RequestHandler = async (req, res) => {
  const input = req.body as { role?: Role; isActive?: boolean };
  if (String(req.params.id) === req.user!.id && (input.role !== undefined || input.isActive === false)) {
    throw new AppError('You cannot remove your own administrator access.', 400, 'SELF_ADMIN_CHANGE');
  }
  if (input.role !== undefined || input.isActive === false) {
    const target = await prisma.user.findUnique({ where: { id: String(req.params.id) } });
    if (!target) throw new AppError('User not found.', 404, 'NOT_FOUND');
    const wouldRemoveAdmin =
      target.role === Role.ADMIN &&
      ((input.role !== undefined && input.role !== Role.ADMIN) || input.isActive === false);
    if (wouldRemoveAdmin) {
      const adminCount = await prisma.user.count({ where: { role: Role.ADMIN, isActive: true } });
      if (adminCount <= 1)
        throw new AppError('At least one active administrator must remain.', 400, 'LAST_ADMIN');
    }
  }
  const user = await prisma.user.update({
    where: { id: String(req.params.id) },
    data: input,
    select: { id: true, name: true, email: true, role: true, isActive: true, createdAt: true },
  });
  return sendData(res, user);
};

export const summary: RequestHandler = async (_req, res) => {
  const [users, properties, pending, inquiries] = await Promise.all([
    prisma.user.count(),
    prisma.property.count(),
    prisma.property.count({ where: { status: PropertyStatus.PENDING } }),
    prisma.inquiry.count({ where: { status: 'NEW' } }),
  ]);
  return sendData(res, { users, properties, pendingReview: pending, newInquiries: inquiries });
};
