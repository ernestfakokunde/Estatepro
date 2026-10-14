import type { RequestHandler } from 'express';
import { InquiryStatus, PropertyStatus, Role } from '@prisma/client';
import { prisma } from '../config/prisma';
import { AppError, sendData } from '../utils/http';

export const list: RequestHandler = async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 20));
  const where = req.user!.role === Role.ADMIN ? {} : { property: { agentId: req.user!.id } };
  const [data, total] = await prisma.$transaction([
    prisma.inquiry.findMany({
      where,
      include: { property: { select: { id: true, title: true, agentId: true } } },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.inquiry.count({ where }),
  ]);
  return res.json({
    success: true,
    data,
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
  });
};

export const updateStatus: RequestHandler = async (req, res) => {
  const input = req.body as { status: InquiryStatus };
  const inquiry = await prisma.inquiry.findUnique({
    where: { id: String(req.params.id) },
    include: { property: { select: { agentId: true } } },
  });
  if (!inquiry) throw new AppError('Inquiry not found.', 404, 'NOT_FOUND');
  if (req.user!.role !== Role.ADMIN && inquiry.property?.agentId !== req.user!.id)
    throw new AppError('You can only manage inquiries for your listings.', 403, 'FORBIDDEN');
  const updated = await prisma.inquiry.update({
    where: { id: inquiry.id },
    data: { status: input.status },
    include: { property: { select: { id: true, title: true, agentId: true } } },
  });
  return sendData(res, updated);
};

export const create: RequestHandler = async (req, res) => {
  const input = req.body as {
    propertyId?: string;
    name: string;
    email: string;
    phone?: string;
    message: string;
  };
  if (input.propertyId) {
    const property = await prisma.property.findFirst({
      where: { id: input.propertyId, status: PropertyStatus.APPROVED },
    });
    if (!property) throw new AppError('Property not found.', 404, 'NOT_FOUND');
  }
  const inquiry = await prisma.inquiry.create({
    data: { ...input, phone: input.phone || null, userId: req.user?.id ?? null },
    select: { id: true, createdAt: true },
  });
  return sendData(
    res,
    { id: inquiry.id, createdAt: inquiry.createdAt, message: 'Your inquiry has been sent.' },
    201,
  );
};
