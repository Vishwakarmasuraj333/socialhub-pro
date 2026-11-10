import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const user = await getSessionUser(req);
    if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const posts = await prisma.post.findMany({
      where: user.organizationId ? { organizationId: user.organizationId } : { userId: user.id },
      include: {
        socialAccounts: {
          include: { socialAccount: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Map into calendar events format
    const events = posts.map((p) => {
      const eventDate = p.scheduledAt || p.publishedAt || p.createdAt;
      return {
        id: p.id,
        title: p.content.slice(0, 60) + (p.content.length > 60 ? '...' : ''),
        content: p.content,
        status: p.status,
        date: eventDate,
        platforms: p.socialAccounts.map((sa) => sa.socialAccount.platform),
        mediaUrls: p.mediaUrls ? JSON.parse(p.mediaUrls) : [],
        accountNames: p.socialAccounts.map((sa) => sa.socialAccount.accountName),
      };
    });

    return NextResponse.json({ events });
  } catch (error: any) {
    return NextResponse.json({ message: 'Failed to fetch calendar events' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await getSessionUser(req);
    if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const { postId, scheduledAt } = await req.json();

    if (!postId || !scheduledAt) {
      return NextResponse.json({ message: 'Post ID and scheduled time are required' }, { status: 400 });
    }

    const updated = await prisma.post.update({
      where: { id: postId },
      data: {
        scheduledAt: new Date(scheduledAt),
        status: 'SCHEDULED',
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Post rescheduled successfully!',
      post: updated,
    });
  } catch (error: any) {
    return NextResponse.json({ message: 'Failed to reschedule post' }, { status: 500 });
  }
}

