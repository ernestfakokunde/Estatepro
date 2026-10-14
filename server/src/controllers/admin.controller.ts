import type { RequestHandler } from 'express';
import { AgentApplicationStatus, PropertyStatus, Role } from '@prisma/client';
import { prisma } from '../config/prisma';
import { sendEmail } from '../services/email.service';
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
  if (input.role === Role.AGENT) {
    const approvedApplication = await prisma.agentProfile.findFirst({
      where: { userId: String(req.params.id), status: AgentApplicationStatus.APPROVED },
    });
    if (!approvedApplication)
      throw new AppError('Approve an agent application before assigning the agent role.', 400, 'AGENT_REVIEW_REQUIRED');
  }
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

export const agentApplications: RequestHandler = async (_req, res) => {
  const applications = await prisma.agentProfile.findMany({
    where: { status: AgentApplicationStatus.PENDING },
    include: {
      user: { select: { id: true, name: true, email: true, phone: true, emailVerified: true, createdAt: true } },
    },
    orderBy: { createdAt: 'asc' },
  });
  return sendData(res, applications);
};

export const reviewAgentApplication: RequestHandler = async (req, res) => {
  const status = req.body.status as AgentApplicationStatus;
  const application = await prisma.agentProfile.findUnique({
    where: { id: String(req.params.id) },
    include: { user: true },
  });
  if (!application) throw new AppError('Agent application not found.', 404, 'NOT_FOUND');
  if (application.status !== AgentApplicationStatus.PENDING)
    throw new AppError('This agent application has already been reviewed.', 409, 'APPLICATION_ALREADY_REVIEWED');
  if (status === AgentApplicationStatus.APPROVED && !application.user.emailVerified)
    throw new AppError('The applicant must verify their email before approval.', 400, 'EMAIL_NOT_VERIFIED');
  const updated = await prisma.$transaction(async (tx) => {
    const profile = await tx.agentProfile.update({
      where: { id: application.id },
      data: { status, reviewedAt: new Date() },
    });
    await tx.user.update({
      where: { id: application.userId },
      data: { role: status === AgentApplicationStatus.APPROVED ? Role.AGENT : Role.USER },
    });
    return profile;
  });
  const outcome = status === AgentApplicationStatus.APPROVED
    ? 'Your email is verified and your EstatePro agent application has been approved. You can now sign in and manage property listings.'
    : 'Your EstatePro agent application was not approved at this time. You can contact our team if you have questions.';
  const emailResult = await Promise.allSettled([
    sendEmail(application.user.email, `EstatePro agent application ${status.toLowerCase()}`, outcome),
  ]);
  if (emailResult[0].status === 'rejected')
    console.error('Agent application decision email failed:', emailResult[0].reason);
  return sendData(res, updated);
};

export const summary: RequestHandler = async (_req, res) => {
  const [users, properties, pending, inquiries, agentApplications] = await Promise.all([
    prisma.user.count(),
    prisma.property.count(),
    prisma.property.count({ where: { status: PropertyStatus.PENDING } }),
    prisma.inquiry.count({ where: { status: 'NEW' } }),
    prisma.agentProfile.count({ where: { status: AgentApplicationStatus.PENDING } }),
  ]);
  return sendData(res, { users, properties, pendingReview: pending, newInquiries: inquiries, agentApplications });
};
