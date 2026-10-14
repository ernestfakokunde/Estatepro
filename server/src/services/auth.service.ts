import bcrypt from 'bcryptjs';
import jwt, { type SignOptions } from 'jsonwebtoken';
import { env } from '../config/env';
import { prisma } from '../config/prisma';
import { AppError } from '../utils/http';

type Credentials = { name?: string; email: string; password: string; phone?: string };

export async function registerUser(input: Credentials) {
  const passwordHash = await bcrypt.hash(input.password, env.BCRYPT_ROUNDS);
  const user = await prisma.user.create({
    data: { name: input.name!, email: input.email.toLowerCase(), phone: input.phone || null, passwordHash },
  });
  return user;
}

export async function authenticateUser(input: Credentials) {
  const user = await prisma.user.findUnique({ where: { email: input.email.toLowerCase() } });
  if (!user || !user.isActive || !(await bcrypt.compare(input.password, user.passwordHash))) {
    throw new AppError('Email or password is incorrect.', 401, 'INVALID_CREDENTIALS');
  }
  return user;
}

export function createSessionToken(user: { id: string; role: string }) {
  return jwt.sign({ role: user.role }, env.JWT_SECRET, {
    subject: user.id,
    expiresIn: env.JWT_EXPIRES_IN as SignOptions['expiresIn'],
  });
}
