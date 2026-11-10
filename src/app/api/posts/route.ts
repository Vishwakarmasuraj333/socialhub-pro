import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const user = await getSessionUser(req);
    if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const platform = searchParams.get('platform');

    const where: any = {
      ...(user.organizationId ? { organizationId: user.organizationId } : { userId: user.id }),
    };

    if (status && status !== 'ALL') {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { content: { contains: search } },
        { hashtags: { contains: search } },
      ];
    }

    if (platform && platform !== 'ALL') {
      where.socialAccounts = {
        some: {
          socialAccount: {
            platform: platform.toUpperCase(),
          },
        },
      };
    }

    const posts = await prisma.post.findMany({
      where,
      include: {
        analytics: true,
        socialAccounts: {
          include: {
            socialAccount: true,
          },
        },
        user: {
          select: {
            name: true,
            avatar: true,
            role: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ posts });
  } catch (error: any) {
    console.error('Fetch posts error:', error);
    return NextResponse.json({ message: 'Failed to fetch posts' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser(req);
    if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const { content, hashtags, mediaUrls, status, scheduledAt, socialAccountIds } = await req.json();

    if (!content && (!mediaUrls || mediaUrls.length === 0)) {
      return NextResponse.json({ message: 'Post content or media is required' }, { status: 400 });
    }

    if (!socialAccountIds || socialAccountIds.length === 0) {
      return NextResponse.json({ message: 'Select at least one social channel' }, { status: 400 });
    }

    const postStatus = status || (scheduledAt ? 'SCHEDULED' : 'DRAFT');

    const post = await prisma.post.create({
      data: {
        userId: user.id,
        organizationId: user.organizationId,
        content: content || '',
        hashtags: hashtags || null,
        mediaUrls: mediaUrls ? JSON.stringify(mediaUrls) : null,
        status: postStatus,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
        publishedAt: postStatus === 'PUBLISHED' ? new Date() : null,
        socialAccounts: {
          create: socialAccountIds.map((accId: string) => ({
            socialAccountId: accId,
            publishStatus: postStatus === 'PUBLISHED' ? 'PUBLISHED' : 'PENDING',
            publishedAt: postStatus === 'PUBLISHED' ? new Date() : null,
            externalPostId: postStatus === 'PUBLISHED' ? `ext_pub_${Math.random().toString(36).substring(2, 10)}` : null,
          })),
        },
      },
      include: {
        socialAccounts: {
          include: { socialAccount: true },
        },
      },
    });

    // If published now, create initial analytics
    if (postStatus === 'PUBLISHED') {
      await prisma.postAnalytics.create({
        data: {
          postId: post.id,
          impressions: Math.floor(Math.random() * 500) + 50,
          reach: Math.floor(Math.random() * 400) + 40,
          likes: Math.floor(Math.random() * 40) + 5,
          comments: Math.floor(Math.random() * 8) + 1,
          shares: Math.floor(Math.random() * 5),
          clicks: Math.floor(Math.random() * 15),
        },
      });
    }

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        organizationId: user.organizationId,
        action: postStatus === 'PUBLISHED' ? 'POST_PUBLISHED' : 'POST_CREATED',
        details: JSON.stringify({ postId: post.id, status: postStatus }),
      },
    });

    return NextResponse.json({
      success: true,
      message: postStatus === 'PUBLISHED' ? 'Post published successfully!' : postStatus === 'SCHEDULED' ? 'Post scheduled successfully!' : 'Post saved as draft.',
      post,
    });
  } catch (error: any) {
    console.error('Create post error:', error);
    return NextResponse.json({ message: error?.message || 'Failed to create post' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = await getSessionUser(req);
    if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ message: 'Post ID required' }, { status: 400 });

    await prisma.postSocialAccount.deleteMany({ where: { postId: id } });
    await prisma.postAnalytics.deleteMany({ where: { postId: id } });
    await prisma.post.delete({ where: { id } });

    return NextResponse.json({ success: true, message: 'Post deleted successfully.' });
  } catch (error: any) {
    return NextResponse.json({ message: 'Failed to delete post' }, { status: 500 });
  }
}

