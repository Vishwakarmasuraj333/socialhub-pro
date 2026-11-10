import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const user = await getSessionUser(req);
    if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const accounts = await prisma.socialAccount.findMany({
      where: user.organizationId ? { organizationId: user.organizationId } : { userId: user.id },
      include: {
        oauthToken: {
          select: {
            expiresAt: true,
            tokenType: true,
            updatedAt: true,
          },
        },
        _count: {
          select: {
            posts: true,
            stories: true,
            conversations: true,
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    return NextResponse.json({ accounts });
  } catch (error: any) {
    return NextResponse.json({ message: 'Failed to fetch accounts' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = await getSessionUser(req);
    if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ message: 'Account ID required' }, { status: 400 });
    }

    const account = await prisma.socialAccount.findUnique({
      where: { id },
    });

    if (!account) {
      return NextResponse.json({ message: 'Account not found' }, { status: 404 });
    }

    await prisma.oAuthToken.deleteMany({ where: { socialAccountId: id } });
    await prisma.socialAccount.delete({ where: { id } });

    await prisma.auditLog.create({
      data: {
        userId: user.id,
        organizationId: user.organizationId,
        action: 'ACCOUNT_DISCONNECTED',
        details: JSON.stringify({ platform: account.platform, username: account.username }),
      },
    });

    return NextResponse.json({ success: true, message: `${account.accountName} has been disconnected.` });
  } catch (error: any) {
    return NextResponse.json({ message: 'Failed to disconnect account' }, { status: 500 });
  }
}

