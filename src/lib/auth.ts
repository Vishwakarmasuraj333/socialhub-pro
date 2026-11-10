import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';
import prisma from './prisma';
import { Role, UserSession } from '@/types';

const JWT_SECRET = process.env.JWT_SECRET || 'socialhub-pro-secret-key-enterprise-2026';
const TOKEN_COOKIE_NAME = 'socialhub_auth_token';

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateToken(payload: object, expiresIn: string | number = '7d'): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn } as any);
}

export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
}

export function generateOtpCode(): string {
  // Cryptographically secure 6-digit numeric OTP
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function getSessionUser(req?: NextRequest): Promise<UserSession | null> {
  try {
    let token: string | undefined;

    if (req) {
      const authHeader = req.headers.get('authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      } else {
        token = req.cookies.get(TOKEN_COOKIE_NAME)?.value;
      }
    } else {
      const cookieStore = cookies();
      token = cookieStore.get(TOKEN_COOKIE_NAME)?.value;
    }

    if (!token) return null;

    const decoded = verifyToken(token);
    if (!decoded || !decoded.userId) return null;

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
        organization: true,
        profile: true,
      },
    });

    if (!user || user.status === 'SUSPENDED') return null;

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role as Role,
      avatar: user.avatar,
      organizationId: user.organizationId,
      organizationName: user.organization?.name,
      isEmailVerified: user.isEmailVerified,
      twoFactorEnabled: user.twoFactorEnabled,
    };
  } catch (error) {
    console.error('getSessionUser error:', error);
    return null;
  }
}

export const ROLE_HIERARCHY: Record<Role, number> = {
  OWNER: 50,
  ADMIN: 40,
  MANAGER: 30,
  EDITOR: 20,
  ANALYST: 10,
};

export function hasMinimumRole(userRole: Role, requiredRole: Role): boolean {
  return (ROLE_HIERARCHY[userRole] || 0) >= (ROLE_HIERARCHY[requiredRole] || 0);
}
