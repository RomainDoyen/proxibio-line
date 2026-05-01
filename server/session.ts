import type { Request } from 'express';
import type { User } from '@prisma/client';
import { prisma } from './db';
import { SESSION_COOKIE, verifySessionToken } from './auth';

export async function getAuthUser(req: Request): Promise<User | null> {
  const token = req.cookies[SESSION_COOKIE] as string | undefined;
  if (!token) {
    return null;
  }
  try {
    const { sub: userId } = verifySessionToken(token);
    return prisma.user.findUnique({ where: { id: userId } });
  } catch {
    return null;
  }
}
