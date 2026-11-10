import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyOtpCode } from '@/lib/email';
import { generateToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { email, code, type } = await req.json();

    if (!email || !code || !type) {
      return NextResponse.json({ message: 'Email, code, and type are required' }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const verification = await verifyOtpCode({
      email: normalizedEmail,
      code,
      type,
    });

    if (!verification.valid) {
      return NextResponse.json({ message: verification.message }, { status: 400 });
    }

    // Process action based on type
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      include: { organization: true },
    });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    if (type === 'REGISTER') {
      await prisma.user.update({
        where: { id: user.id },
        data: { isEmailVerified: true },
      });
    }

    // If type is REGISTER or LOGIN_2FA, issue session cookie
    if (type === 'REGISTER' || type === 'LOGIN_2FA') {
      const token = generateToken({
        userId: user.id,
        email: user.email,
        role: user.role,
      });

      await prisma.session.create({
        data: {
          userId: user.id,
          token,
          userAgent: req.headers.get('user-agent'),
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      });

      const response = NextResponse.json({
        success: true,
        token,
        message: 'Verification successful',
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          avatar: user.avatar,
          organizationId: user.organizationId,
          organizationName: user.organization?.name,
          isEmailVerified: true,
          twoFactorEnabled: user.twoFactorEnabled,
        },
      });

      response.cookies.set('socialhub_auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60,
        path: '/',
      });

      return response;
    }

    // If type is PASSWORD_RESET, return a reset token
    if (type === 'PASSWORD_RESET') {
      const resetToken = `rst_${Math.random().toString(36).substring(2)}${Date.now().toString(36)}`;
      await prisma.passwordResetToken.create({
        data: {
          userId: user.id,
          token: resetToken,
          expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 mins
        },
      });

      return NextResponse.json({
        success: true,
        message: 'Code verified. You may now reset your password.',
        resetToken,
      });
    }

    return NextResponse.json({ success: true, message: 'Code verified successfully.' });
  } catch (error: any) {
    console.error('OTP Verify error:', error);
    return NextResponse.json({ message: error?.message || 'Verification error' }, { status: 500 });
  }
}
