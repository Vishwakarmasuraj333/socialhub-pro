import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyPassword, generateToken } from '@/lib/auth';
import { sendOtpEmail } from '@/lib/email';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      include: {
        organization: true,
      },
    });

    if (!user) {
      return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
    }

    if (user.status === 'SUSPENDED') {
      return NextResponse.json({ message: 'Account is suspended. Please contact enterprise support.' }, { status: 403 });
    }

    const isMatch = await verifyPassword(password, user.passwordHash);
    if (!isMatch) {
      return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
    }

    // Check if 2FA is enabled
    if (user.twoFactorEnabled) {
      const otpRes = await sendOtpEmail({
        email: user.email,
        userId: user.id,
        type: 'LOGIN_2FA',
      });

      return NextResponse.json({
        requires2FA: true,
        email: user.email,
        message: 'Enter the 6-digit verification code sent to your email to complete login.',
      });
    }

    // Generate JWT
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // Record session
    await prisma.session.create({
      data: {
        userId: user.id,
        token,
        userAgent: req.headers.get('user-agent'),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        organizationId: user.organizationId,
        action: 'USER_LOGIN',
        details: JSON.stringify({ method: 'PASSWORD' }),
      },
    });

    const response = NextResponse.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar,
        organizationId: user.organizationId,
        organizationName: user.organization?.name,
        isEmailVerified: user.isEmailVerified,
        twoFactorEnabled: user.twoFactorEnabled,
      },
    });

    // Set secure HTTP-only cookie
    response.cookies.set('socialhub_auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    });

    return response;
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json({ message: error?.message || 'Server error during sign in' }, { status: 500 });
  }
}
