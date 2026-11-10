import { describe, it, expect } from 'vitest';
import { PLATFORM_REGISTRY, getPlatformConfig } from '../src/lib/social-oauth';
import { SocialPlatform } from '../src/types';

describe('🌐 Social Media OAuth & Multi-Platform Registry Suite', () => {
  const supportedPlatforms: SocialPlatform[] = [
    'INSTAGRAM',
    'FACEBOOK',
    'YOUTUBE',
    'LINKEDIN',
    'TIKTOK',
    'TWITTER',
    'PINTEREST',
  ];

  it('should support all 7 official social media platforms', () => {
    supportedPlatforms.forEach((platform) => {
      const config = PLATFORM_REGISTRY[platform];
      expect(config).toBeDefined();
      expect(config.platform).toBe(platform);
      expect(config.name).toBeTruthy();
      expect(config.brandColor).toMatch(/^#[0-9A-Fa-f]{6}$/);
      expect(config.gradient).toBeTruthy();
      expect(config.description).toBeTruthy();
    });
  });

  it('should enforce accurate character limits per platform specification', () => {
    // Twitter/X: 280
    expect(PLATFORM_REGISTRY.TWITTER.maxCharacters).toBe(280);
    // Pinterest: 500
    expect(PLATFORM_REGISTRY.PINTEREST.maxCharacters).toBe(500);
    // Instagram: 2200
    expect(PLATFORM_REGISTRY.INSTAGRAM.maxCharacters).toBe(2200);
    // TikTok: 2200
    expect(PLATFORM_REGISTRY.TIKTOK.maxCharacters).toBe(2200);
    // LinkedIn: 3000
    expect(PLATFORM_REGISTRY.LINKEDIN.maxCharacters).toBe(3000);
    // YouTube: 5000
    expect(PLATFORM_REGISTRY.YOUTUBE.maxCharacters).toBe(5000);
    // Facebook: 63206
    expect(PLATFORM_REGISTRY.FACEBOOK.maxCharacters).toBe(63206);
  });

  it('should accurately define platform media and story capabilities', () => {
    // Instagram supports images, video, and 24h stories
    expect(PLATFORM_REGISTRY.INSTAGRAM.supportsImages).toBe(true);
    expect(PLATFORM_REGISTRY.INSTAGRAM.supportsVideo).toBe(true);
    expect(PLATFORM_REGISTRY.INSTAGRAM.supportsStories).toBe(true);
    expect(PLATFORM_REGISTRY.INSTAGRAM.maxImages).toBe(10);

    // Facebook supports images, video, and stories
    expect(PLATFORM_REGISTRY.FACEBOOK.supportsStories).toBe(true);

    // TikTok supports video and stories
    expect(PLATFORM_REGISTRY.TIKTOK.supportsVideo).toBe(true);
    expect(PLATFORM_REGISTRY.TIKTOK.supportsStories).toBe(true);

    // YouTube requires video, does not support standalone static photos
    expect(PLATFORM_REGISTRY.YOUTUBE.supportsVideo).toBe(true);
    expect(PLATFORM_REGISTRY.YOUTUBE.supportsImages).toBe(false);
    expect(PLATFORM_REGISTRY.YOUTUBE.supportsStories).toBe(false);

    // Twitter allows up to 4 images
    expect(PLATFORM_REGISTRY.TWITTER.maxImages).toBe(4);

    // LinkedIn allows up to 9 images
    expect(PLATFORM_REGISTRY.LINKEDIN.maxImages).toBe(9);
  });

  it('should return fallback configuration gracefully for unrecognized platform key', () => {
    const unknown = getPlatformConfig('THREADS' as any);
    expect(unknown).toBeDefined();
    expect(unknown.name).toBe('THREADS');
    expect(unknown.maxCharacters).toBeGreaterThan(0);
  });
});

