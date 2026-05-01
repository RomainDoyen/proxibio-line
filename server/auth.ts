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
  sameSite: 'lax' | 'none';
  path: string;
  maxAge: number;
  secure: boolean;
} {
  const cross =
    process.env.CROSS_ORIGIN_COOKIES === '1' ||
    process.env.CROSS_ORIGIN_COOKIES === 'true';
  const secure = cross || process.env.NODE_ENV === 'production';
  return {
    httpOnly: true,
    sameSite: cross ? 'none' : 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    secure,
  };
}

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 10);
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

/** Options pour `clearCookie` : doivent correspondre au cookie posé (même path / sameSite / secure). */
export function sessionClearCookieOptions(): {
  path: string;
  httpOnly: boolean;
  sameSite: 'lax' | 'none';
  secure: boolean;
} {
  const o = sessionCookieOptions();
  return { path: o.path, httpOnly: o.httpOnly, sameSite: o.sameSite, secure: o.secure };
}
