export type Role = 'OWNER' | 'ADMIN' | 'MANAGER' | 'EDITOR' | 'ANALYST';

export type SocialPlatform =
  | 'INSTAGRAM'
  | 'FACEBOOK'
  | 'YOUTUBE'
  | 'LINKEDIN'
  | 'TIKTOK'
  | 'TWITTER'
  | 'PINTEREST'
  | 'SNAPCHAT'
  | 'KICK';

export type PostStatus = 'DRAFT' | 'SCHEDULED' | 'PUBLISHED' | 'FAILED' | 'PENDING_APPROVAL';

export type StoryStatus = 'DRAFT' | 'SCHEDULED' | 'ACTIVE' | 'ARCHIVED';

export type Priority = 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';

export type ConversationType = 'DIRECT_MESSAGE' | 'COMMENT' | 'MENTION' | 'REVIEW';

export interface UserSession {
  id: string;
  email: string;
  name: string;
  role: Role;
  avatar?: string | null;
  organizationId?: string | null;
  organizationName?: string;
  isEmailVerified: boolean;
  twoFactorEnabled: boolean;
}

export interface PlatformConfig {
  name: string;
  platform: SocialPlatform;
  icon: string;
  brandColor: string;
  gradient: string;
  maxCharacters: number;
  supportsVideo: boolean;
  supportsImages: boolean;
  maxImages: number;
  supportsStories: boolean;
  description: string;
}

