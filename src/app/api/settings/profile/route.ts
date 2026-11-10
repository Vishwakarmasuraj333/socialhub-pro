import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const user = await getSessionUser(req);
    if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const fullUser = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        profile: true,
        organization: true,
      },
    });

    return NextResponse.json({ user: fullUser });
  } catch (error: any) {
    return NextResponse.json({ message: 'Failed to fetch profile' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await getSessionUser(req);
    if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const { name, avatar, bio, phone, timezone, language, jobTitle, company, website, themePreference } = await req.json();

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        ...(name ? { name: name.trim() } : {}),
        ...(avatar !== undefined ? { avatar } : {}),
        profile: {
          upsert: {
            create: {
              bio,
              phone,
              timezone: timezone || 'UTC',
              language: language || 'en',
              jobTitle,
              company,
              website,
              themePreference: themePreference || 'dark',
            },
            update: {
              ...(bio !== undefined ? { bio } : {}),
              ...(phone !== undefined ? { phone } : {}),
              ...(timezone ? { timezone } : {}),
              ...(language ? { language } : {}),
              ...(jobTitle !== undefined ? { jobTitle } : {}),
              ...(company !== undefined ? { company } : {}),
              ...(website !== undefined ? { website } : {}),
              ...(themePreference ? { themePreference } : {}),
            },
          },
        },
      },
      include: {
        profile: true,
      },
    });

    return NextResponse.json({ success: true, message: 'Profile updated successfully', user: updatedUser });
  } catch (error: any) {
    return NextResponse.json({ message: 'Failed to update profile' }, { status: 500 });
  }
}

