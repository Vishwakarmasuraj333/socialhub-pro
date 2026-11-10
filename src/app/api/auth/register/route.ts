import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { hashPassword, generateToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, companyName } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ message: 'Name, email, and password are required' }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ message: 'Password must be at least 8 characters long' }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (existingUser) {
      return NextResponse.json({ message: 'An account with this email already exists' }, { status: 409 });
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create organization
    const orgName = companyName?.trim() || `${name.trim()}'s Organization`;
    const orgSlug = `${orgName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now().toString(36)}`;

    const org = await prisma.organization.create({
      data: {
        name: orgName,
        slug: orgSlug,
        plan: 'PRO',
      },
    });

    // Create User - Verified on signup so instant trial access starts immediately!
    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        passwordHash,
        role: 'ADMIN',
        organizationId: org.id,
        isEmailVerified: true,
        twoFactorEnabled: false,
        profile: {
          create: {
            company: orgName,
            themePreference: 'dark',
          },
        },
      },
      include: {
        organization: true,
      },
    });

    // Generate JWT Auth Token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // Record active session
    await prisma.session.create({
      data: {
        userId: user.id,
        token,
        userAgent: req.headers.get('user-agent'),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    // Create Audit Log
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        organizationId: org.id,
        action: 'USER_REGISTER',
        details: JSON.stringify({ method: 'PASSWORD', trialPlan: 'PRO' }),
      },
    });

    const response = NextResponse.json({
      success: true,
      message: 'Account created! Welcome to your 14-day free trial.',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar,
        organizationId: user.organizationId,
        organizationName: org.name,
        isEmailVerified: user.isEmailVerified,
        twoFactorEnabled: user.twoFactorEnabled,
      },
    });

    // Set secure HTTP-only cookie for instant authentication
    response.cookies.set('socialhub_auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error: any) {
    console.error('Registration API error:', error);
    return NextResponse.json({ message: error?.message || 'Server error during registration' }, { status: 500 });
  }
}
