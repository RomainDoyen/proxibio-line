import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export const SESSION_COOKIE = 'proxibio_session';

export function getJwtSecret(): string {
  const s = process.env.JWT_SECRET;
  if (!s) {
    throw new Error('JWT_SECRET est requis dans .env');
  }
  return s;
}

export function signSessionToken(userId: string): string {
  return jwt.sign({ sub: userId }, getJwtSecret(), { expiresIn: '7d' });
}

export function verifySessionToken(token: string): { sub: string } {
  return jwt.verify(token, getJwtSecret()) as { sub: string };
}

export function sessionCookieOptions(): {
  httpOnly: boolean;
  sameSite: 'lax';
  path: string;
  maxAge: number;
  secure: boolean;
} {
  return {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    secure: process.env.NODE_ENV === 'production',
  };
}

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 10);
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}
