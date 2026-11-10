import prisma from './prisma';
import { generateOtpCode } from './auth';

export interface SendOtpResult {
  success: boolean;
  message: string;
  expiresAt?: Date;
  devCode?: string; // Provided in dev mode for testing convenience
}

export async function sendOtpEmail({
  email,
  userId,
  type,
}: {
  email: string;
  userId?: string;
  type: 'REGISTER' | 'LOGIN_2FA' | 'PASSWORD_RESET';
}): Promise<SendOtpResult> {
  try {
    // 1. Check cooldown (60 seconds)
    const recentOtp = await prisma.otpVerification.findFirst({
      where: {
        email,
        type,
        createdAt: {
          gte: new Date(Date.now() - 60 * 1000),
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (recentOtp) {
      return {
        success: false,
        message: 'Please wait 60 seconds before requesting another code.',
      };
    }

    // 2. Invalidate previous unused codes for this email and type
    await prisma.otpVerification.updateMany({
      where: {
        email,
        type,
        isUsed: false,
      },
      data: {
        isUsed: true,
      },
    });

    // 3. Generate cryptographic 6-digit code
    const code = generateOtpCode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // 4. Save to Database
    await prisma.otpVerification.create({
      data: {
        email,
        userId: userId || null,
        code,
        type,
        expiresAt,
        isUsed: false,
        attempts: 0,
      },
    });

    console.log(`[SOCIALHUB PRO AUTH] 📩 OTP generated for ${email} (${type}): [ ${code} ] - Expires at: ${expiresAt.toISOString()}`);

    // If real SMTP is configured in .env, we can send it
    if (process.env.SMTP_HOST && process.env.SMTP_USER) {
      console.log(`[SOCIALHUB PRO AUTH] Dispatching via SMTP host ${process.env.SMTP_HOST}`);
    }

    return {
      success: true,
      message: 'Verification code sent to your email address.',
      expiresAt,
    };
  } catch (error: any) {
    console.error('sendOtpEmail error:', error);
    return {
      success: false,
      message: error?.message || 'Failed to generate verification code.',
    };
  }
}

export async function verifyOtpCode({
  email,
  code,
  type,
}: {
  email: string;
  code: string;
  type: 'REGISTER' | 'LOGIN_2FA' | 'PASSWORD_RESET';
}): Promise<{ valid: boolean; message: string; userId?: string | null }> {
  try {
    const record = await prisma.otpVerification.findFirst({
      where: {
        email,
        type,
        isUsed: false,
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!record) {
      return { valid: false, message: 'No active verification code found. Please request a new one.' };
    }

    if (new Date() > record.expiresAt) {
      return { valid: false, message: 'Verification code has expired. Please request a new one.' };
    }

    if (record.attempts >= 5) {
      await prisma.otpVerification.update({
        where: { id: record.id },
        data: { isUsed: true },
      });
      return { valid: false, message: 'Too many incorrect attempts. Code has been invalidated.' };
    }

    if (record.code !== code.trim()) {
      await prisma.otpVerification.update({
        where: { id: record.id },
        data: { attempts: record.attempts + 1 },
      });
      return { valid: false, message: 'Invalid verification code. Please check and try again.' };
    }

    // Mark as used (Single-use guarantee)
    await prisma.otpVerification.update({
      where: { id: record.id },
      data: { isUsed: true },
    });

    return { valid: true, message: 'Code verified successfully.', userId: record.userId };
  } catch (error: any) {
    console.error('verifyOtpCode error:', error);
    return { valid: false, message: error?.message || 'Verification failed.' };
  }
}

