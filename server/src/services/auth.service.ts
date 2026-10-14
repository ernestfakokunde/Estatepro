import bcrypt from 'bcryptjs';
import { createHash, randomBytes } from 'node:crypto';
import jwt, { type SignOptions } from 'jsonwebtoken';
import { EmailTokenType } from '@prisma/client';
import { env } from '../config/env';
import { prisma } from '../config/prisma';
import { sendEmail } from './email.service';
import { AppError } from '../utils/http';

type Credentials = { name?: string; email: string; password: string; phone?: string };

export async function registerUser(input: Credentials) {
  const passwordHash = await bcrypt.hash(input.password, env.BCRYPT_ROUNDS);
  const user = await prisma.user.create({
    data: {
      name: input.name!,
      email: input.email.toLowerCase(),
      phone: input.phone || null,
      passwordHash,
      emailVerified: false,
    },
  });
  return user;
}

export async function registerAgent(input: Credentials & {
  agency?: string;
  licenseNumber?: string;
  bio?: string;
}) {
  return prisma.user.create({
    data: {
      name: input.name!,
      email: input.email.toLowerCase(),
      phone: input.phone || null,
      passwordHash: await bcrypt.hash(input.password, env.BCRYPT_ROUNDS),
      emailVerified: false,
      agentProfile: {
        create: {
          agency: input.agency || null,
          licenseNumber: input.licenseNumber || null,
          bio: input.bio || null,
        },
      },
    },
  });
}

export async function createEmailToken(userId: string, type: EmailTokenType) {
  const token = randomBytes(32).toString('hex');
  const tokenHash = createHash('sha256').update(token).digest('hex');
  const ttlMs = type === EmailTokenType.VERIFY_EMAIL ? 24 * 60 * 60 * 1000 : 60 * 60 * 1000;
  await prisma.$transaction([
    prisma.emailToken.deleteMany({ where: { userId, type } }),
    prisma.emailToken.create({ data: { userId, type, tokenHash, expiresAt: new Date(Date.now() + ttlMs) } }),
  ]);
  return token;
}

export async function sendVerificationLink(userId: string, email: string) {
  const token = await createEmailToken(userId, EmailTokenType.VERIFY_EMAIL);
  const link = `${env.CLIENT_URL}/verify-email?token=${token}`;
  await sendEmail(email, 'Verify your EstatePro email', `Verify your email address using this link:\n\n${link}\n\nThis link expires in 24 hours.`);
}

export async function sendPasswordResetLink(userId: string, email: string) {
  const token = await createEmailToken(userId, EmailTokenType.RESET_PASSWORD);
  const link = `${env.CLIENT_URL}/reset-password?token=${token}`;
  await sendEmail(email, 'Reset your EstatePro password', `Reset your password using this link:\n\n${link}\n\nThis link expires in one hour. If you did not request this, ignore this email.`);
}

export async function verifyEmailToken(token: string) {
  const tokenHash = createHash('sha256').update(token).digest('hex');
  const record = await prisma.emailToken.findUnique({ where: { tokenHash } });
  if (!record || record.type !== EmailTokenType.VERIFY_EMAIL || record.expiresAt <= new Date())
    throw new AppError('This verification link is invalid or has expired.', 400, 'INVALID_TOKEN');
  await prisma.$transaction([
    prisma.user.update({ where: { id: record.userId }, data: { emailVerified: true } }),
    prisma.emailToken.delete({ where: { id: record.id } }),
  ]);
  const agentProfile = await prisma.agentProfile.findUnique({ where: { userId: record.userId } });
  return { agentApplicationPending: agentProfile?.status === 'PENDING' };
}

export async function resetPasswordWithToken(token: string, password: string) {
  const tokenHash = createHash('sha256').update(token).digest('hex');
  const record = await prisma.emailToken.findUnique({ where: { tokenHash } });
  if (!record || record.type !== EmailTokenType.RESET_PASSWORD || record.expiresAt <= new Date())
    throw new AppError('This password reset link is invalid or has expired.', 400, 'INVALID_TOKEN');
  const passwordHash = await bcrypt.hash(password, env.BCRYPT_ROUNDS);
  await prisma.$transaction([
    prisma.user.update({ where: { id: record.userId }, data: { passwordHash } }),
    prisma.emailToken.delete({ where: { id: record.id } }),
    prisma.emailToken.deleteMany({ where: { userId: record.userId, type: EmailTokenType.RESET_PASSWORD } }),
  ]);
}

export async function authenticateUser(input: Credentials) {
  const user = await prisma.user.findUnique({ where: { email: input.email.toLowerCase() } });
  if (!user || !user.isActive || !(await bcrypt.compare(input.password, user.passwordHash))) {
    throw new AppError('Email or password is incorrect.', 401, 'INVALID_CREDENTIALS');
  }
  if (!user.emailVerified)
    throw new AppError('Verify your email before signing in. Check your inbox for the verification link.', 403, 'EMAIL_NOT_VERIFIED');
  return user;
}

export function createSessionToken(user: { id: string; role: string }) {
  return jwt.sign({ role: user.role }, env.JWT_SECRET, {
    subject: user.id,
    expiresIn: env.JWT_EXPIRES_IN as SignOptions['expiresIn'],
  });
}
