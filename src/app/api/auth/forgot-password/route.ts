import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { sendOtpEmail } from '@/lib/email';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ message: 'Email is required' }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      // Return success to avoid email enumeration attacks
      return NextResponse.json({
        success: true,
        message: 'If an account exists with this email, a reset code has been sent.',
      });
    }

    const otpRes = await sendOtpEmail({
      email: user.email,
      userId: user.id,
      type: 'PASSWORD_RESET',
    });

    return NextResponse.json({
      success: true,
      message: 'Password reset code sent to your email.',
    });
  } catch (error: any) {
    return NextResponse.json({ message: 'Error processing password reset' }, { status: 500 });
  }
}

