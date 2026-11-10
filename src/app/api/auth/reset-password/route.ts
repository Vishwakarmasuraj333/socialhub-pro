import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { resetToken, newPassword } = await req.json();

    if (!resetToken || !newPassword) {
      return NextResponse.json({ message: 'Token and new password are required' }, { status: 400 });
    }

    if (newPassword.length < 8) {
      return NextResponse.json({ message: 'Password must be at least 8 characters long' }, { status: 400 });
    }

    const tokenRecord = await prisma.passwordResetToken.findUnique({
      where: { token: resetToken },
    });

    if (!tokenRecord || tokenRecord.isUsed || new Date() > tokenRecord.expiresAt) {
      return NextResponse.json({ message: 'Invalid or expired reset token' }, { status: 400 });
    }

    const passwordHash = await hashPassword(newPassword);

    await prisma.$transaction([
      prisma.user.update({
        where: { id: tokenRecord.userId },
        data: { passwordHash },
      }),
      prisma.passwordResetToken.update({
        where: { id: tokenRecord.id },
        data: { isUsed: true },
      }),
    ]);

    return NextResponse.json({
      success: true,
      message: 'Password successfully updated. You may now sign in with your new password.',
    });
  } catch (error: any) {
    return NextResponse.json({ message: 'Error resetting password' }, { status: 500 });
  }
}

