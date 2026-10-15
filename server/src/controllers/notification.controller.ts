import type { RequestHandler } from 'express';
import { prisma } from '../config/prisma';
import { AppError, sendData } from '../utils/http';

export const list: RequestHandler = async (req, res) => {
  const userId = req.user!.id;
  const [items, unreadCount] = await prisma.$transaction([
    prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 100,
    }),
    prisma.notification.count({ where: { userId, readAt: null } }),
  ]);
  return sendData(res, { items, unreadCount });
};

export const unreadCount: RequestHandler = async (req, res) => {
  const count = await prisma.notification.count({ where: { userId: req.user!.id, readAt: null } });
  return sendData(res, { unreadCount: count });
};

export const markRead: RequestHandler = async (req, res) => {
  const id = String(req.params.id);
  const notification = await prisma.notification.findFirst({
    where: { id, userId: req.user!.id },
    select: { id: true, readAt: true },
  });
  if (!notification) throw new AppError('Notification not found.', 404, 'NOT_FOUND');
  if (!notification.readAt) {
    await prisma.notification.update({ where: { id }, data: { readAt: new Date() } });
  }
  return sendData(res, { id, readAt: notification.readAt ?? new Date() });
};

export const markAllRead: RequestHandler = async (req, res) => {
  const result = await prisma.notification.updateMany({
    where: { userId: req.user!.id, readAt: null },
    data: { readAt: new Date() },
  });
  return sendData(res, { updated: result.count });
};
