import { describe, it, expect } from 'vitest';

const BASE_URL = 'http://localhost:3000';

describe('🚀 Comprehensive End-to-End API Integration Suite', () => {
  let authToken = '';
  let testCreatedPostId = '';
  let socialAccountIds: string[] = [];

  describe('1. Authentication & Session Endpoints', () => {
    it('rejects unauthenticated requests to protected endpoints with 401', async () => {
      const res = await fetch(`${BASE_URL}/api/auth/me`);
      expect(res.status).toBe(401);
      const data = await res.json();
      expect(data.message).toMatch(/Unauthorized/i);
    });

    it('rejects invalid login credentials with 401 and an error message', async () => {
      const res = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'sarah.chen@socialhubpro.com',
          password: 'CompletelyWrongPassword!',
        }),
      });

      expect(res.status).toBe(401);
      const data = await res.json();
      expect(data.message).toMatch(/Invalid email or password/i);
    });

    it('successfully authenticates valid manager credentials and receives JWT', async () => {
      const res = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'sarah.chen@socialhubpro.com',
          password: 'Password123!',
        }),
      });

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.user).toBeDefined();
      expect(data.user.email).toBe('sarah.chen@socialhubpro.com');
      expect(data.user.role).toBe('MANAGER');
      expect(data.token).toBeDefined();
      authToken = data.token;
    });

    it('retrieves the active user profile using the authenticated Bearer token', async () => {
      const res = await fetch(`${BASE_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.user).toBeDefined();
      expect(data.user.name).toBe('Sarah Chen');
      expect(data.user.organizationName).toBe('Apex Global Media Group');
    });
  });

  describe('2. Dashboard & Social Accounts Endpoints', () => {
    it('fetches real dashboard aggregate metrics and platform breakdowns', async () => {
      const res = await fetch(`${BASE_URL}/api/dashboard/stats`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.stats).toBeDefined();
      expect(data.stats.totalConnectedAccounts).toBe(7);
      expect(data.stats.totalFollowers).toBeGreaterThan(1000000);
      expect(data.stats.totalReach).toBeGreaterThan(0);
      expect(data.stats.totalEngagement).toBeGreaterThan(0);
      expect(data.stats.totalPublishedPosts).toBeGreaterThanOrEqual(1);
      expect(Array.isArray(data.recentActivity)).toBe(true);
      expect(data.recentActivity.length).toBeGreaterThan(0);
      expect(Array.isArray(data.charts.platformBreakdown)).toBe(true);
      expect(data.charts.platformBreakdown.length).toBe(7);
    });

    it('fetches all 7 connected social media accounts with profile metadata', async () => {
      const res = await fetch(`${BASE_URL}/api/accounts`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(Array.isArray(data.accounts)).toBe(true);
      expect(data.accounts.length).toBe(7);

      socialAccountIds = data.accounts.map((a: any) => a.id);
      const platforms = data.accounts.map((a: any) => a.platform);
      expect(platforms).toContain('INSTAGRAM');
      expect(platforms).toContain('FACEBOOK');
      expect(platforms).toContain('YOUTUBE');
      expect(platforms).toContain('LINKEDIN');
      expect(platforms).toContain('TIKTOK');
      expect(platforms).toContain('TWITTER');
      expect(platforms).toContain('PINTEREST');

      data.accounts.forEach((acc: any) => {
        expect(acc.accountName).toBeTruthy();
        expect(acc.username).toBeTruthy();
        expect(acc.followersCount).toBeGreaterThan(0);
        expect(acc.status).toBe('CONNECTED');
      });
    });
  });

  describe('3. Post Creation, Studio & Immediate Publishing Endpoints', () => {
    it('creates a new multi-platform draft post via POST /api/posts', async () => {
      const res = await fetch(`${BASE_URL}/api/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          content: '🚀 Automated E2E verification post: Testing real-time social syndication! #TechInnovation #SaaS',
          socialAccountIds: socialAccountIds.slice(0, 2),
          mediaUrls: ['https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80'],
          status: 'DRAFT',
        }),
      });

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.post).toBeDefined();
      expect(data.post.id).toBeDefined();
      expect(data.post.status).toBe('DRAFT');
      testCreatedPostId = data.post.id;
    });

    it('immediately publishes the draft post via POST /api/posts/publish', async () => {
      const res = await fetch(`${BASE_URL}/api/posts/publish`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          postId: testCreatedPostId,
        }),
      });

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.success).toBe(true);
    });

    it('lists published posts including the newly syndicated post', async () => {
      const res = await fetch(`${BASE_URL}/api/posts`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(Array.isArray(data.posts)).toBe(true);
      const found = data.posts.find((p: any) => p.id === testCreatedPostId);
      expect(found).toBeDefined();
      expect(found.status).toBe('PUBLISHED');
    });
  });

  describe('4. Social Inbox & Real-Time Messaging Endpoints', () => {
    let conversationId = '';

    it('fetches customer conversations across connected channels', async () => {
      const res = await fetch(`${BASE_URL}/api/inbox`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(Array.isArray(data.conversations)).toBe(true);
      expect(data.conversations.length).toBeGreaterThanOrEqual(1);

      conversationId = data.conversations[0].id;
      expect(data.conversations[0].messages).toBeDefined();
      expect(data.conversations[0].messages.length).toBeGreaterThan(0);
    });

    it('dispatches an outbound reply to an inbound conversation', async () => {
      const replyMessage = 'Thank you for reaching out! Our team is available 24/7 to support your growth.';
      const res = await fetch(`${BASE_URL}/api/inbox`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          conversationId,
          content: replyMessage,
        }),
      });

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.message).toBeDefined();
      expect(data.message.content).toBe(replyMessage);
      expect(data.message.senderType).toBe('USER');
    });
  });

  describe('5. Calendar, Analytics & Team Endpoints', () => {
    it('fetches calendar schedule with timezone handling', async () => {
      const res = await fetch(`${BASE_URL}/api/calendar`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(Array.isArray(data.events)).toBe(true);
      expect(data.events.length).toBeGreaterThan(0);
    });

    it('retrieves comprehensive 30-day analytics trends', async () => {
      const res = await fetch(`${BASE_URL}/api/analytics?range=30d`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(Array.isArray(data.timeline)).toBe(true);
      expect(data.timeline.length).toBe(30);
      expect(Array.isArray(data.platformBreakdown)).toBe(true);
      expect(data.bestTimes).toBeDefined();
      expect(data.demographics).toBeDefined();
    });

    it('retrieves enterprise team members and permissions', async () => {
      const res = await fetch(`${BASE_URL}/api/team`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(Array.isArray(data.members)).toBe(true);
      expect(data.members.length).toBeGreaterThanOrEqual(4);
    });
  });

  describe('6. Public CMS & Knowledge Base Endpoints', () => {
    it('fetches public blog posts without requiring authentication', async () => {
      const res = await fetch(`${BASE_URL}/api/blog`);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(Array.isArray(data.posts)).toBe(true);
      expect(data.posts.length).toBe(3);
      expect(data.posts[0].title).toBeTruthy();
      expect(data.posts[0].slug).toBeTruthy();
      expect(data.posts[0].content).toBeTruthy();
    }, 15000);

    it('fetches a single blog post by slug with SEO metadata', async () => {
      const res = await fetch(`${BASE_URL}/api/blog?slug=omnichannel-social-strategy-2026`);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.post).toBeDefined();
      expect(data.post.slug).toBe('omnichannel-social-strategy-2026');
      expect(data.post.title).toContain('Omnichannel');
      expect(data.post.author).toBeDefined();
    });
  });
});
