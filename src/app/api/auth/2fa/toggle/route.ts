import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser(req);
    if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const { enabled } = await req.json();

    await prisma.user.update({
      where: { id: user.id },
      data: { twoFactorEnabled: Boolean(enabled) },
    });

    return NextResponse.json({
      success: true,
      twoFactorEnabled: Boolean(enabled),
      message: `Two-Factor Authentication has been ${enabled ? 'enabled' : 'disabled'}.`,
    });
  } catch (error: any) {
    return NextResponse.json({ message: 'Failed to update 2FA status' }, { status: 500 });
  }
}

