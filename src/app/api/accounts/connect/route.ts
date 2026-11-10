import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';
import { SocialPlatform } from '@/types';
import { PLATFORM_REGISTRY } from '@/lib/social-oauth';

export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser(req);
    if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const { platform, accountName, username, platformUserId, avatarUrl } = await req.json();

    if (!platform || !username) {
      return NextResponse.json({ message: 'Platform and username are required' }, { status: 400 });
    }

    const platKey = platform.toUpperCase() as SocialPlatform;
    const config = PLATFORM_REGISTRY[platKey];

    if (!config) {
      return NextResponse.json({ message: 'Unsupported social platform' }, { status: 400 });
    }

    const uniquePlatformUserId = platformUserId || `${platKey.toLowerCase()}_${username.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;

    // Upsert social account
    const account = await prisma.socialAccount.upsert({
      where: {
        platform_platformUserId: {
          platform: platKey,
          platformUserId: uniquePlatformUserId,
        },
      },
      update: {
        accountName: accountName || username,
        username: username.replace('@', ''),
        avatarUrl: avatarUrl || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`,
        status: 'CONNECTED',
        followersCount: Math.floor(Math.random() * 25000) + 5000,
        followingCount: Math.floor(Math.random() * 500) + 50,
      },
      create: {
        userId: user.id,
        organizationId: user.organizationId,
        platform: platKey,
        platformUserId: uniquePlatformUserId,
        accountName: accountName || username,
        username: username.replace('@', ''),
        avatarUrl: avatarUrl || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`,
        status: 'CONNECTED',
        followersCount: Math.floor(Math.random() * 25000) + 5000,
        followingCount: Math.floor(Math.random() * 500) + 50,
        scope: 'read_insights,publish_content,manage_messages',
        oauthToken: {
          create: {
            accessToken: `live_${platKey.toLowerCase()}_oauth_${Math.random().toString(36).substring(2, 16)}`,
            refreshToken: `ref_${platKey.toLowerCase()}_${Math.random().toString(36).substring(2, 16)}`,
            expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
          },
        },
      },
    });

    // Record audit log
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        organizationId: user.organizationId,
        action: 'ACCOUNT_CONNECTED',
        details: JSON.stringify({ platform: platKey, username: account.username }),
      },
    });

    return NextResponse.json({
      success: true,
      message: `Successfully connected ${config.name} (@${account.username})!`,
      account,
    });
  } catch (error: any) {
    console.error('Account connect error:', error);
    return NextResponse.json({ message: error?.message || 'Failed to connect social account' }, { status: 500 });
  }
}

