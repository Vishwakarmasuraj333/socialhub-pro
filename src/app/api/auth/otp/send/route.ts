import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { sendOtpEmail } from '@/lib/email';

export async function POST(req: NextRequest) {
  try {
    const { email, type } = await req.json();

    if (!email || !type) {
      return NextResponse.json({ message: 'Email and type are required' }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    const result = await sendOtpEmail({
      email: normalizedEmail,
      userId: user?.id,
      type,
    });

    if (!result.success) {
      return NextResponse.json({ message: result.message }, { status: 429 });
    }

    return NextResponse.json({
      success: true,
      message: result.message,
    });
  } catch (error: any) {
    console.error('OTP Send error:', error);
    return NextResponse.json({ message: 'Failed to send verification code' }, { status: 500 });
  }
}

