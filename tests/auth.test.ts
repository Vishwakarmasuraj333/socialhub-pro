import { describe, it, expect } from 'vitest';
import {
  hashPassword,
  verifyPassword,
  generateToken,
  verifyToken,
  generateOtpCode,
  hasMinimumRole,
} from '../src/lib/auth';

describe('🔐 Security & Cryptographic Authentication Suite', () => {
  it('should securely hash passwords with bcrypt and verify correctly', async () => {
    const rawPass = 'EnterpriseSecret2026!';
    const hashed = await hashPassword(rawPass);

    expect(hashed).not.toBe(rawPass);
    expect(hashed.startsWith('$2')).toBe(true);

    const isMatch = await verifyPassword(rawPass, hashed);
    expect(isMatch).toBe(true);

    const isBadMatch = await verifyPassword('WrongPassword123!', hashed);
    expect(isBadMatch).toBe(false);
  });

  it('should sign and verify valid JWT tokens with session payloads', () => {
    const payload = { userId: 'usr_enterprise_991', email: 'alex.morgan@socialhubpro.com', role: 'ADMIN' };
    const token = generateToken(payload, '1h');

    expect(token).toBeDefined();
    expect(typeof token).toBe('string');
    expect(token.split('.').length).toBe(3);

    const decoded = verifyToken(token);
    expect(decoded).toBeDefined();
    expect(decoded.userId).toBe(payload.userId);
    expect(decoded.email).toBe(payload.email);
    expect(decoded.role).toBe('ADMIN');
  });

  it('should reject invalid or tampered JWT tokens', () => {
    const invalidToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.tampered.signature';
    const decoded = verifyToken(invalidToken);
    expect(decoded).toBeNull();
  });

  it('should generate cryptographically secure 6-digit numeric OTP codes', () => {
    const codes = new Set<string>();
    for (let i = 0; i < 50; i++) {
      const code = generateOtpCode();
      expect(code).toMatch(/^\d{6}$/);
      expect(code.length).toBe(6);
      codes.add(code);
    }
    // Check distribution uniqueness across 50 iterations
    expect(codes.size).toBeGreaterThanOrEqual(48);
  });

  it('should correctly enforce Role-Based Access Hierarchy (RBAC)', () => {
    // OWNER has highest privilege
    expect(hasMinimumRole('OWNER', 'ADMIN')).toBe(true);
    expect(hasMinimumRole('OWNER', 'MANAGER')).toBe(true);
    expect(hasMinimumRole('OWNER', 'EDITOR')).toBe(true);
    expect(hasMinimumRole('OWNER', 'ANALYST')).toBe(true);

    // ADMIN hierarchy
    expect(hasMinimumRole('ADMIN', 'ADMIN')).toBe(true);
    expect(hasMinimumRole('ADMIN', 'MANAGER')).toBe(true);
    expect(hasMinimumRole('ADMIN', 'EDITOR')).toBe(true);
    expect(hasMinimumRole('ADMIN', 'OWNER')).toBe(false);

    // MANAGER hierarchy
    expect(hasMinimumRole('MANAGER', 'MANAGER')).toBe(true);
    expect(hasMinimumRole('MANAGER', 'EDITOR')).toBe(true);
    expect(hasMinimumRole('MANAGER', 'ADMIN')).toBe(false);

    // EDITOR hierarchy
    expect(hasMinimumRole('EDITOR', 'EDITOR')).toBe(true);
    expect(hasMinimumRole('EDITOR', 'MANAGER')).toBe(false);

    // ANALYST hierarchy
    expect(hasMinimumRole('ANALYST', 'ANALYST')).toBe(true);
    expect(hasMinimumRole('ANALYST', 'EDITOR')).toBe(false);
  });
});

