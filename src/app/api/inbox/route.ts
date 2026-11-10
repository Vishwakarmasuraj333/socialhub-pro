import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const user = await getSessionUser(req);
    if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    const platform = searchParams.get('platform');
    const unreadOnly = searchParams.get('unreadOnly') === 'true';

    const where: any = {};

    if (type && type !== 'ALL') where.type = type;
    if (status && status !== 'ALL') where.status = status;
    if (priority && priority !== 'ALL') where.priority = priority;
    if (unreadOnly) where.unread = true;

    if (platform && platform !== 'ALL') {
      where.socialAccount = {
        platform: platform.toUpperCase(),
      };
    }

    const conversations = await prisma.conversation.findMany({
      where,
      include: {
        socialAccount: true,
        assignedTo: {
          select: { id: true, name: true, avatar: true, role: true },
        },
        messages: {
          orderBy: { createdAt: 'asc' },
          include: {
            senderUser: {
              select: { id: true, name: true, avatar: true },
            },
          },
        },
      },
      orderBy: { lastMessageAt: 'desc' },
    });

    return NextResponse.json({ conversations });
  } catch (error: any) {
    console.error('Inbox GET error:', error);
    return NextResponse.json({ message: 'Failed to fetch inbox conversations' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser(req);
    if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const { conversationId, content } = await req.json();

    if (!conversationId || !content?.trim()) {
      return NextResponse.json({ message: 'Conversation ID and message content are required' }, { status: 400 });
    }

    const message = await prisma.message.create({
      data: {
        conversationId,
        senderType: 'USER',
        senderUserId: user.id,
        content: content.trim(),
      },
      include: {
        senderUser: {
          select: { id: true, name: true, avatar: true },
        },
      },
    });

    await prisma.conversation.update({
      where: { id: conversationId },
      data: {
        lastMessageAt: new Date(),
        unread: false,
      },
    });

    return NextResponse.json({ success: true, message });
  } catch (error: any) {
    return NextResponse.json({ message: 'Failed to send reply' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const user = await getSessionUser(req);
    if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const { conversationId, status, priority, assignedToId, unread } = await req.json();

    if (!conversationId) {
      return NextResponse.json({ message: 'Conversation ID is required' }, { status: 400 });
    }

    const updateData: any = {};
    if (status !== undefined) updateData.status = status;
    if (priority !== undefined) updateData.priority = priority;
    if (assignedToId !== undefined) updateData.assignedToId = assignedToId;
    if (unread !== undefined) updateData.unread = Boolean(unread);

    const updated = await prisma.conversation.update({
      where: { id: conversationId },
      data: updateData,
    });

    return NextResponse.json({ success: true, conversation: updated });
  } catch (error: any) {
    return NextResponse.json({ message: 'Failed to update conversation' }, { status: 500 });
  }
}

