import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const user = await getSessionUser(req);
    if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const stories = await prisma.story.findMany({
      where: user.organizationId ? { organizationId: user.organizationId } : { userId: user.id },
      include: {
        socialAccount: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const active = stories.filter((s) => s.status === 'ACTIVE');
    const scheduled = stories.filter((s) => s.status === 'SCHEDULED');
    const archived = stories.filter((s) => s.status === 'ARCHIVED');

    return NextResponse.json({
      stories,
      categorized: { active, scheduled, archived },
    });
  } catch (error: any) {
    return NextResponse.json({ message: 'Failed to fetch stories' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser(req);
    if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const { socialAccountId, mediaUrl, mediaType, caption, scheduledAt, status } = await req.json();

    if (!socialAccountId || !mediaUrl) {
      return NextResponse.json({ message: 'Social account and media URL are required' }, { status: 400 });
    }

    const storyStatus = status || (scheduledAt ? 'SCHEDULED' : 'ACTIVE');
    const publishedAt = storyStatus === 'ACTIVE' ? new Date() : null;
    const expiresAt = publishedAt ? new Date(publishedAt.getTime() + 24 * 60 * 60 * 1000) : null;

    const story = await prisma.story.create({
      data: {
        userId: user.id,
        organizationId: user.organizationId,
        socialAccountId,
        mediaUrl,
        mediaType: mediaType || 'IMAGE',
        caption: caption || null,
        status: storyStatus,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
        publishedAt,
        expiresAt,
        viewsCount: storyStatus === 'ACTIVE' ? Math.floor(Math.random() * 120) + 10 : 0,
      },
      include: {
        socialAccount: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: storyStatus === 'ACTIVE' ? 'Story published live!' : 'Story scheduled successfully!',
      story,
    });
  } catch (error: any) {
    return NextResponse.json({ message: error?.message || 'Failed to create story' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = await getSessionUser(req);
    if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ message: 'Story ID required' }, { status: 400 });

    await prisma.story.delete({ where: { id } });

    return NextResponse.json({ success: true, message: 'Story deleted successfully.' });
  } catch (error: any) {
    return NextResponse.json({ message: 'Failed to delete story' }, { status: 500 });
  }
}

