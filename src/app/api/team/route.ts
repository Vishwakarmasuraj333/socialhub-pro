import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionUser, hashPassword } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const user = await getSessionUser(req);
    if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const orgId = user.organizationId;
    if (!orgId) return NextResponse.json({ members: [] });

    const users = await prisma.user.findMany({
      where: { organizationId: orgId },
      include: {
        profile: true,
      },
      orderBy: { createdAt: 'asc' },
    });

    const members = users.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      avatar: u.avatar,
      jobTitle: u.profile?.jobTitle || 'Team Member',
      status: u.status,
      createdAt: u.createdAt,
    }));

    return NextResponse.json({ members });
  } catch (error: any) {
    return NextResponse.json({ message: 'Failed to fetch team members' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser(req);
    if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    if (user.role !== 'OWNER' && user.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Only Admins can invite team members' }, { status: 403 });
    }

    const { name, email, role, jobTitle } = await req.json();

    if (!name || !email || !role) {
      return NextResponse.json({ message: 'Name, email, and role are required' }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (existing) {
      return NextResponse.json({ message: 'User already exists with this email' }, { status: 409 });
    }

    const tempPassword = `Invite#${Math.random().toString(36).substring(2, 8)}!`;
    const passwordHash = await hashPassword(tempPassword);

    const newMember = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        passwordHash,
        role: role.toUpperCase(),
        organizationId: user.organizationId,
        isEmailVerified: true,
        profile: {
          create: {
            jobTitle: jobTitle || 'Team Member',
            themePreference: 'dark',
          },
        },
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: user.id,
        organizationId: user.organizationId,
        action: 'TEAM_MEMBER_INVITED',
        details: JSON.stringify({ email: newMember.email, role: newMember.role }),
      },
    });

    return NextResponse.json({
      success: true,
      message: `Invitation sent to ${newMember.email}!`,
      member: {
        id: newMember.id,
        name: newMember.name,
        email: newMember.email,
        role: newMember.role,
        jobTitle: jobTitle || 'Team Member',
      },
      temporaryPasswordNotice: `Temporary password: ${tempPassword}`,
    });
  } catch (error: any) {
    console.error('Invite member error:', error);
    return NextResponse.json({ message: 'Failed to invite team member' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const user = await getSessionUser(req);
    if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    if (user.role !== 'OWNER' && user.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Permission denied' }, { status: 403 });
    }

    const { memberId, role } = await req.json();

    if (!memberId || !role) {
      return NextResponse.json({ message: 'Member ID and role required' }, { status: 400 });
    }

    const updated = await prisma.user.update({
      where: { id: memberId },
      data: { role: role.toUpperCase() },
    });

    return NextResponse.json({ success: true, message: 'Role updated successfully', user: updated });
  } catch (error: any) {
    return NextResponse.json({ message: 'Failed to update role' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = await getSessionUser(req);
    if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    if (user.role !== 'OWNER' && user.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Permission denied' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ message: 'Member ID required' }, { status: 400 });

    if (id === user.id) {
      return NextResponse.json({ message: 'You cannot remove yourself' }, { status: 400 });
    }

    await prisma.profile.deleteMany({ where: { userId: id } });
    await prisma.user.delete({ where: { id } });

    return NextResponse.json({ success: true, message: 'Team member removed.' });
  } catch (error: any) {
    return NextResponse.json({ message: 'Failed to remove member' }, { status: 500 });
  }
}

