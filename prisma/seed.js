const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed for SOCIALHUB PRO...');

  // Clean existing data
  await prisma.auditLog.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.message.deleteMany();
  await prisma.conversation.deleteMany();
  await prisma.accountAnalytics.deleteMany();
  await prisma.postAnalytics.deleteMany();
  await prisma.postSocialAccount.deleteMany();
  await prisma.post.deleteMany();
  await prisma.story.deleteMany();
  await prisma.oAuthToken.deleteMany();
  await prisma.socialAccount.deleteMany();
  await prisma.teamMember.deleteMany();
  await prisma.team.deleteMany();
  await prisma.subscription.deleteMany();
  await prisma.session.deleteMany();
  await prisma.otpVerification.deleteMany();
  await prisma.passwordResetToken.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.blogPost.deleteMany();
  await prisma.user.deleteMany();
  await prisma.organization.deleteMany();

  // 1. Create Organization
  const org = await prisma.organization.create({
    data: {
      name: 'Apex Global Media Group',
      slug: 'apex-global-media',
      plan: 'ENTERPRISE',
      logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80',
    },
  });

  // 2. Create Primary Admin User (Suraj Vishwakarma)
  const hashedPassword = await bcrypt.hash('Password123!', 10);
  const mainUser = await prisma.user.create({
    data: {
      email: 'itxsurajofficial@gmail.com',
      passwordHash: hashedPassword,
      name: 'Suraj Vishwakarma',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      role: 'ADMIN',
      isEmailVerified: true,
      twoFactorEnabled: false,
      status: 'ACTIVE',
      organizationId: org.id,
      profile: {
        create: {
          bio: 'Founder & Chief Administrator. Managing enterprise social media operations and omnichannel growth.',
          phone: '+91 98765 43210',
          timezone: 'Asia/Kolkata',
          language: 'en',
          themePreference: 'dark',
          jobTitle: 'Super Administrator',
          company: 'Apex Global Media Group',
          website: 'https://socialhubpro.com',
        },
      },
    },
  });

  // Also create Alex Morgan as Manager for legacy test compatibility
  await prisma.user.create({
    data: {
      email: 'alex.morgan@socialhubpro.com',
      passwordHash: hashedPassword,
      name: 'Alex Morgan',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      role: 'ADMIN',
      isEmailVerified: true,
      twoFactorEnabled: false,
      status: 'ACTIVE',
      organizationId: org.id,
      profile: {
        create: {
          bio: 'VP of Social Operations.',
          timezone: 'America/New_York',
          language: 'en',
          themePreference: 'dark',
          jobTitle: 'VP of Social Operations',
          company: 'Apex Global Media Group',
        },
      },
    },
  });

  // 3. Create Additional Team Members
  const teamMemberUsers = await Promise.all([
    prisma.user.create({
      data: {
        email: 'sarah.chen@socialhubpro.com',
        passwordHash: hashedPassword,
        name: 'Sarah Chen',
        avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
        role: 'MANAGER',
        isEmailVerified: true,
        organizationId: org.id,
        profile: {
          create: {
            jobTitle: 'Social Content Manager',
            company: 'Apex Global Media',
            themePreference: 'dark',
          },
        },
      },
    }),
    prisma.user.create({
      data: {
        email: 'marcus.vance@socialhubpro.com',
        passwordHash: hashedPassword,
        name: 'Marcus Vance',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
        role: 'EDITOR',
        isEmailVerified: true,
        organizationId: org.id,
        profile: {
          create: {
            jobTitle: 'Lead Video & Visual Producer',
            company: 'Apex Global Media',
            themePreference: 'dark',
          },
        },
      },
    }),
    prisma.user.create({
      data: {
        email: 'elena.rostova@socialhubpro.com',
        passwordHash: hashedPassword,
        name: 'Elena Rostova',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
        role: 'ANALYST',
        isEmailVerified: true,
        organizationId: org.id,
        profile: {
          create: {
            jobTitle: 'Growth & Social Data Scientist',
            company: 'Apex Global Media',
            themePreference: 'dark',
          },
        },
      },
    }),
  ]);

  // 4. Create Teams
  const growthTeam = await prisma.team.create({
    data: {
      organizationId: org.id,
      name: 'Global Growth & Content',
      description: 'Handles cross-platform audience growth, brand publishing, and engagement.',
      members: {
        create: [
          { userId: mainUser.id, role: 'ADMIN' },
          { userId: teamMemberUsers[0].id, role: 'MANAGER' },
          { userId: teamMemberUsers[1].id, role: 'EDITOR' },
          { userId: teamMemberUsers[2].id, role: 'ANALYST' },
        ],
      },
    },
  });

  // 5. Create Subscription
  await prisma.subscription.create({
    data: {
      organizationId: org.id,
      plan: 'ENTERPRISE',
      status: 'ACTIVE',
      currentPeriodStart: new Date(),
      currentPeriodEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      stripeCustomerId: 'cus_apex_ent_9921',
      stripeSubscriptionId: 'sub_live_ent_5532',
    },
  });

  // 6. Create Connected Social Accounts
  const platforms = [
    {
      platform: 'INSTAGRAM',
      platformUserId: 'ig_apex_brand_01',
      accountName: 'Apex Brand Official',
      username: 'apex.brand',
      avatarUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
      followersCount: 142800,
      followingCount: 385,
      scope: 'instagram_basic,instagram_content_publish,pages_read_engagement',
    },
    {
      platform: 'LINKEDIN',
      platformUserId: 'li_apex_global_02',
      accountName: 'Apex Global Media Group',
      username: 'apex-global-media',
      avatarUrl: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=150&auto=format&fit=crop&q=80',
      followersCount: 88500,
      followingCount: 120,
      scope: 'w_member_social,r_organization_social,w_organization_social',
    },
    {
      platform: 'TWITTER',
      platformUserId: 'tw_apex_now_03',
      accountName: 'Apex Global Now',
      username: 'ApexGlobalNow',
      avatarUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
      followersCount: 104200,
      followingCount: 650,
      scope: 'tweet.read,tweet.write,users.read,offline.access',
    },
    {
      platform: 'TIKTOK',
      platformUserId: 'tt_apex_creativelab_04',
      accountName: 'Apex Creative Lab',
      username: 'apexcreativelab',
      avatarUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=150&auto=format&fit=crop&q=80',
      followersCount: 326900,
      followingCount: 210,
      scope: 'user.info.basic,video.list,video.upload',
    },
    {
      platform: 'YOUTUBE',
      platformUserId: 'yt_apex_media_05',
      accountName: 'Apex Media Tech',
      username: 'ApexMediaTech',
      avatarUrl: 'https://images.unsplash.com/photo-1533750349088-cd871a92f312?w=150&auto=format&fit=crop&q=80',
      followersCount: 468000,
      followingCount: 48,
      scope: 'youtube.readonly,youtube.upload',
    },
    {
      platform: 'FACEBOOK',
      platformUserId: 'fb_apex_page_06',
      accountName: 'Apex Global Official Page',
      username: 'apexmediaofficial',
      avatarUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=150&auto=format&fit=crop&q=80',
      followersCount: 96400,
      followingCount: 312,
      scope: 'pages_manage_posts,pages_read_engagement,pages_show_list',
    },
    {
      platform: 'PINTEREST',
      platformUserId: 'pin_apex_design_07',
      accountName: 'Apex Visual & Design Studio',
      username: 'apexdesignstudio',
      avatarUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=150&auto=format&fit=crop&q=80',
      followersCount: 43200,
      followingCount: 89,
      scope: 'boards:read,pins:read,pins:write',
    },
  ];

  const createdSocialAccounts = [];

  for (const p of platforms) {
    const acc = await prisma.socialAccount.create({
      data: {
        userId: mainUser.id,
        organizationId: org.id,
        platform: p.platform,
        platformUserId: p.platformUserId,
        accountName: p.accountName,
        username: p.username,
        avatarUrl: p.avatarUrl,
        followersCount: p.followersCount,
        followingCount: p.followingCount,
        status: 'CONNECTED',
        scope: p.scope,
        oauthToken: {
          create: {
            accessToken: `live_tok_${p.platform.toLowerCase()}_sec_${Math.random().toString(36).substring(2, 15)}`,
            refreshToken: `ref_tok_${p.platform.toLowerCase()}_${Math.random().toString(36).substring(2, 15)}`,
            expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
          },
        },
      },
    });
    createdSocialAccounts.push(acc);
  }

  // 7. Seed 30-Day Historical Analytics for Charts
  const now = new Date();
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);

    for (const acc of createdSocialAccounts) {
      const baseFollowers = acc.followersCount - i * 140;
      const dailyImp = Math.floor(Math.random() * 8000) + 12000;
      const dailyReach = Math.floor(dailyImp * 0.72);
      const dailyEng = Math.floor(dailyImp * 0.058);

      await prisma.accountAnalytics.create({
        data: {
          socialAccountId: acc.id,
          date,
          followers: baseFollowers,
          impressions: dailyImp,
          reach: dailyReach,
          engagement: dailyEng,
          clicks: Math.floor(dailyEng * 0.32),
        },
      });
    }
  }

  // 8. Create Posts (Published, Scheduled, Drafts, Pending Approval)
  const postsData = [
    {
      content: '🚀 We are thrilled to announce the launch of our next-generation Enterprise Omnichannel suite! Real-time synchronization, unified inboxes, and AI-powered performance scheduling are now live for all enterprise teams. #EnterpriseSaaS #SocialMarketing #Innovation #Growth',
      hashtags: '#EnterpriseSaaS, #SocialMarketing, #Innovation',
      mediaUrls: JSON.stringify(['https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80']),
      status: 'PUBLISHED',
      publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      platformsToLink: ['INSTAGRAM', 'LINKEDIN', 'TWITTER'],
      analytics: {
        impressions: 48200,
        reach: 39500,
        likes: 2940,
        comments: 184,
        shares: 412,
        clicks: 1250,
      },
    },
    {
      content: '📊 Data Spotlight: Teams managing 5+ social networks in a unified dashboard save on average 14.2 hours per week per manager. How does your brand handle campaign fragmentation? Drop your workflow tips below! 👇',
      hashtags: '#Productivity #SocialStrategy #MarketingOps',
      mediaUrls: JSON.stringify(['https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&auto=format&fit=crop&q=80']),
      status: 'PUBLISHED',
      publishedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      platformsToLink: ['LINKEDIN', 'TWITTER', 'FACEBOOK'],
      analytics: {
        impressions: 31400,
        reach: 26100,
        likes: 1890,
        comments: 245,
        shares: 198,
        clicks: 860,
      },
    },
    {
      content: '🎥 Behind the scenes of our creative studio in London: From raw 4K footage to multi-ratio vertical stories in under 10 minutes. Watch the full walkthrough on YouTube! Link in bio.',
      hashtags: '#BehindTheScenes #CreativeStudio #VideoProduction',
      mediaUrls: JSON.stringify(['https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&auto=format&fit=crop&q=80']),
      status: 'PUBLISHED',
      publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
      platformsToLink: ['YOUTUBE', 'TIKTOK', 'INSTAGRAM'],
      analytics: {
        impressions: 72400,
        reach: 58900,
        likes: 6420,
        comments: 480,
        shares: 910,
        clicks: 3410,
      },
    },
    {
      content: '✨ Exclusive Q4 Playbook: The changing landscape of TikTok Search SEO vs traditional Google queries. Why micro-keywords in video captions determine 60% of discovery in 2026. #SEO #TikTokGrowth #SocialSEO',
      hashtags: '#SEO, #TikTokGrowth, #SocialSEO',
      mediaUrls: JSON.stringify(['https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80']),
      status: 'SCHEDULED',
      scheduledAt: new Date(Date.now() + 18 * 60 * 60 * 1000),
      platformsToLink: ['TIKTOK', 'INSTAGRAM', 'LINKEDIN'],
    },
    {
      content: '💡 Friday Feature Highlight: Smart approval workflows allow senior brand leaders to review, comment on, and authorize cross-platform releases from mobile or desktop in seconds.',
      hashtags: '#ProductUpdate #Workflows #BrandSafety',
      mediaUrls: JSON.stringify(['https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80']),
      status: 'SCHEDULED',
      scheduledAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      platformsToLink: ['LINKEDIN', 'TWITTER'],
    },
    {
      content: '🎨 Aesthetic Moodboard: Exploring luxury minimal design palettes, champagne accents, and timeless typography. What inspires your visual branding this season?',
      hashtags: '#DesignInspiration #Branding #VisualIdentity',
      mediaUrls: JSON.stringify(['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80']),
      status: 'SCHEDULED',
      scheduledAt: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
      platformsToLink: ['PINTEREST', 'INSTAGRAM'],
    },
    {
      content: '📝 [Draft] Annual State of Global Social Media Advertising Benchmark 2026 - Key Findings & CPC Trends across Meta, TikTok, and YouTube.',
      hashtags: '#AdSpend #Benchmarks #MarketingData',
      mediaUrls: JSON.stringify(['https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80']),
      status: 'DRAFT',
      platformsToLink: ['LINKEDIN', 'TWITTER'],
    },
    {
      content: '⚡ [Pending Approval] High-impact influencer partnership announcement with global fashion creators. Scheduled for Monday morning embargo release.',
      hashtags: '#Partnership #BrandAmbassador #Launch',
      mediaUrls: JSON.stringify(['https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=800&auto=format&fit=crop&q=80']),
      status: 'PENDING_APPROVAL',
      scheduledAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      platformsToLink: ['INSTAGRAM', 'TIKTOK', 'FACEBOOK'],
    },
  ];

  for (const postItem of postsData) {
    const post = await prisma.post.create({
      data: {
        userId: mainUser.id,
        organizationId: org.id,
        content: postItem.content,
        hashtags: postItem.hashtags,
        mediaUrls: postItem.mediaUrls,
        status: postItem.status,
        scheduledAt: postItem.scheduledAt || null,
        publishedAt: postItem.publishedAt || null,
      },
    });

    if (postItem.analytics) {
      await prisma.postAnalytics.create({
        data: {
          postId: post.id,
          ...postItem.analytics,
        },
      });
    }

    for (const plat of postItem.platformsToLink) {
      const match = createdSocialAccounts.find((a) => a.platform === plat);
      if (match) {
        await prisma.postSocialAccount.create({
          data: {
            postId: post.id,
            socialAccountId: match.id,
            publishStatus: postItem.status === 'PUBLISHED' ? 'PUBLISHED' : 'PENDING',
            publishedAt: postItem.publishedAt || null,
            externalPostId: postItem.status === 'PUBLISHED' ? `ext_${plat.toLowerCase()}_${Math.random().toString(36).substring(2, 9)}` : null,
          },
        });
      }
    }
  }

  // 9. Stories Management
  const igAccount = createdSocialAccounts.find((a) => a.platform === 'INSTAGRAM');
  const ttAccount = createdSocialAccounts.find((a) => a.platform === 'TIKTOK');

  if (igAccount) {
    await prisma.story.createMany({
      data: [
        {
          userId: mainUser.id,
          organizationId: org.id,
          socialAccountId: igAccount.id,
          mediaUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80',
          mediaType: 'IMAGE',
          caption: 'Live from our New York Strategy Summit! 🗽✨ Swipe up for the live recap stream.',
          status: 'ACTIVE',
          publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
          expiresAt: new Date(Date.now() + 20 * 60 * 60 * 1000),
          viewsCount: 4830,
        },
        {
          userId: mainUser.id,
          organizationId: org.id,
          socialAccountId: igAccount.id,
          mediaUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=600&auto=format&fit=crop&q=80',
          mediaType: 'IMAGE',
          caption: 'Sneak peek at our upcoming product redesign. Burgundy and gold luxury theme incoming! 🔥',
          status: 'SCHEDULED',
          scheduledAt: new Date(Date.now() + 12 * 60 * 60 * 1000),
          viewsCount: 0,
        },
        {
          userId: mainUser.id,
          organizationId: org.id,
          socialAccountId: igAccount.id,
          mediaUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
          mediaType: 'IMAGE',
          caption: 'Q3 Highlights & Creator Spotlight archive.',
          status: 'ARCHIVED',
          publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          expiresAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
          viewsCount: 14200,
        },
      ],
    });
  }

  // 10. Unified Social Inbox
  if (igAccount) {
    const convo1 = await prisma.conversation.create({
      data: {
        socialAccountId: igAccount.id,
        senderName: 'Sophia Lorenza',
        senderUsername: 'sophia.lorenza',
        senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
        type: 'DIRECT_MESSAGE',
        status: 'OPEN',
        priority: 'HIGH',
        assignedToId: mainUser.id,
        unread: true,
        lastMessageAt: new Date(Date.now() - 15 * 60 * 1000),
        messages: {
          create: [
            {
              senderType: 'CUSTOMER',
              content: 'Hi Apex Team! We are featuring your enterprise platform in our European Tech Innovators summit next month. Who is the best contact for speaker coordination?',
              createdAt: new Date(Date.now() - 25 * 60 * 1000),
            },
            {
              senderType: 'USER',
              senderUserId: mainUser.id,
              content: 'Hello Sophia! Thank you so much for reaching out. We would be delighted to participate! Let me connect you directly with our VP of Global Partnerships.',
              createdAt: new Date(Date.now() - 15 * 60 * 1000),
            },
          ],
        },
      },
    });

    const convo2 = await prisma.conversation.create({
      data: {
        socialAccountId: igAccount.id,
        senderName: 'David K. Miller',
        senderUsername: 'davidkmiller',
        senderAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
        type: 'COMMENT',
        status: 'OPEN',
        priority: 'NORMAL',
        assignedToId: teamMemberUsers[0].id,
        unread: false,
        lastMessageAt: new Date(Date.now() - 45 * 60 * 1000),
        messages: {
          create: [
            {
              senderType: 'CUSTOMER',
              content: 'Is TikTok Shop integration included in the standard Enterprise plan or as an add-on?',
              createdAt: new Date(Date.now() - 45 * 60 * 1000),
            },
          ],
        },
      },
    });
  }

  const liAccount = createdSocialAccounts.find((a) => a.platform === 'LINKEDIN');
  if (liAccount) {
    await prisma.conversation.create({
      data: {
        socialAccountId: liAccount.id,
        senderName: 'Dr. Arthur Pendelton',
        senderUsername: 'arthur-pendelton-phd',
        senderAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80',
        type: 'DIRECT_MESSAGE',
        status: 'RESOLVED',
        priority: 'NORMAL',
        assignedToId: mainUser.id,
        unread: false,
        lastMessageAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        messages: {
          create: [
            {
              senderType: 'CUSTOMER',
              content: 'Excellent report on omnichannel ROI. I shared your benchmark figures with our board this morning.',
              createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
            },
            {
              senderType: 'USER',
              senderUserId: mainUser.id,
              content: 'Thank you Dr. Pendelton! We deeply appreciate the support. Feel free to ping anytime if you need custom breakdown data.',
              createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
            },
          ],
        },
      },
    });
  }

  // 11. Blog Posts
  const blogPostsData = [
    {
      slug: 'omnichannel-social-strategy-2026',
      title: 'The 2026 Omnichannel Social Strategy: Unifying Algorithms, Inboxes, and Analytics',
      excerpt: 'How modern digital enterprises synchronize content distribution across seven major networks without diluting brand voice or burning out teams.',
      category: 'Social Media Strategy',
      tags: 'strategy,omnichannel,growth,enterprise',
      readingTime: '6 min read',
      coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&auto=format&fit=crop&q=80',
      content: `## The Era of Channel Specialization Is Over

Modern audiences do not inhabit a single digital platform. The average consumer moves seamlessly between TikTok for short-form discovery, YouTube for deep-dive tutorials, LinkedIn for professional authority, and Instagram for lifestyle connection.

When organizations treat these channels in silos, three catastrophic failures occur:
1. **Audience dissonance**: Disconnected messaging that breaks brand trust.
2. **Operational burnout**: Teams re-formatting, re-uploading, and manually tracking metrics across fragmented tabs.
3. **Delayed customer response**: Customer inquiries sit unanswered in secondary social inboxes for days.

### Unifying the Dashboard

SOCIALHUB PRO was engineered specifically to solve this enterprise operational bottleneck. By synchronizing account OAuth endpoints through official graph APIs, social marketing teams gain:

* **Centralized Publishing Studio**: Compose once, customize aspect ratios, hashtags, and platform-specific constraints.
* **Unified Inbox Routing**: Direct messages, comments, and mentions triaged into a single priority queue with RBAC assignment.
* **Aggregated Performance Metrics**: Compare engagement velocity between reels, pins, tweets, and shorts side-by-side.

> "Organizations that centralize their social infrastructure achieve an average 42% lift in engagement velocity while decreasing publishing turnaround by 65%."

### Key Takeaways for High-Growth Brands

1. **Audit your current connection topology**: Replace third-party scraping tools with official OAuth 2.0 authorized applications.
2. **Standardize approval workflows**: Require tier-two review for high-reach corporate channels while granting editors fast lanes for timely trends.
3. **Automate calendar scheduling with timezone awareness**: Ensure your European, Asian, and American audiences receive optimal posting timestamps without midnight alarms.`,
    },
    {
      slug: 'ai-driven-multi-platform-scheduling',
      title: 'How AI-Driven Multi-Platform Scheduling Increases Engagement by 180%',
      excerpt: 'Discover how machine learning models determine ideal posting slots per audience cohort and platform algorithm dynamics.',
      category: 'Productivity & Automation',
      tags: 'ai,scheduling,algorithms,automation',
      readingTime: '5 min read',
      coverImage: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=1200&auto=format&fit=crop&q=80',
      content: `## Beyond Generic 'Best Time to Post' Guides

Traditional marketing advice claims 'Tuesday at 10 AM' is optimal. For an enterprise with global followers, this advice is not only obsolete—it actively damages post velocity.

### Dynamic Audience Graph Analysis

Each social account possesses a unique graph topology. Followers in Tokyo, London, and San Francisco wake, commute, work, and scroll at vastly different rhythms.

By monitoring rolling 90-day engagement signals per channel, SOCIALHUB PRO dynamically computes the exact statistical peak when the highest percentage of your active audience is currently in-app.

### Feature Highlights
- **Smart Queue Engine**: Add posts to an intelligent queue that automatically slots them into high-conversion windows.
- **Conflict Prevention**: Never double-post or oversaturate your audience during breaking news cycles.
- **Multi-Ratio Media Validation**: Automatically validates video bitrates, aspect ratios, and character limits before scheduling.`,
    },
    {
      slug: 'enterprise-social-inbox-sla',
      title: 'Enterprise Social Inbox: Slashing Response Times from Hours to Minutes',
      excerpt: 'Customer expectations have changed: 74% of buyers expect social media responses within 60 minutes. Here is how modern leaders achieve it.',
      category: 'Customer Experience',
      tags: 'inbox,support,sla,teamwork',
      readingTime: '4 min read',
      coverImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&auto=format&fit=crop&q=80',
      content: `## Social Media Is the New Support Desk

When a client or prospective buyer encounters a barrier, they rarely open a formal support ticket. They tweet, comment, or send a direct Instagram message.

If your team takes 24 hours to respond, that customer has already researched your competitor.

### How SOCIALHUB PRO Solves Social Support
* **Multi-Platform Webhooks**: Direct messages and comments ingest into the unified inbox within 500 milliseconds.
* **Intelligent Tagging**: Priority labels (High, Normal, Low) automatically assigned based on sentiment and urgency.
* **Team Assignment & Audit Trails**: Assign messages to specific teammates, view typing status, and resolve issues collaboratively.`,
    },
  ];

  for (const b of blogPostsData) {
    await prisma.blogPost.create({
      data: {
        ...b,
        authorId: mainUser.id,
      },
    });
  }

  // 12. Notifications & Audit Logs
  await prisma.notification.createMany({
    data: [
      {
        userId: mainUser.id,
        title: 'New Post Scheduled',
        message: 'Your post "Exclusive Q4 Playbook" is scheduled for tomorrow at 10:00 AM across TikTok, Instagram, and LinkedIn.',
        type: 'PUBLISH',
        link: '/dashboard/posts',
      },
      {
        userId: mainUser.id,
        title: 'High-Priority Message',
        message: 'Sophia Lorenza sent an urgent partnership inquiry on Instagram.',
        type: 'INBOX',
        link: '/dashboard/inbox',
      },
      {
        userId: mainUser.id,
        title: 'Weekly Analytics Report Ready',
        message: 'Your engagement rate increased by +24.8% across connected accounts this week.',
        type: 'SUCCESS',
        link: '/dashboard/analytics',
      },
      {
        userId: mainUser.id,
        title: 'Token Refresh Succeeded',
        message: 'YouTube & TikTok OAuth credentials were automatically refreshed.',
        type: 'INFO',
        link: '/dashboard/accounts',
      },
    ],
  });

  await prisma.auditLog.createMany({
    data: [
      {
        userId: mainUser.id,
        organizationId: org.id,
        action: 'ACCOUNT_CONNECTED',
        details: JSON.stringify({ platform: 'INSTAGRAM', username: 'apex.brand' }),
        ipAddress: '192.168.1.104',
      },
      {
        userId: mainUser.id,
        organizationId: org.id,
        action: 'POST_PUBLISHED',
        details: JSON.stringify({ postId: 'post_01', platforms: ['INSTAGRAM', 'LINKEDIN', 'TWITTER'] }),
        ipAddress: '192.168.1.104',
      },
      {
        userId: mainUser.id,
        organizationId: org.id,
        action: 'TEAM_MEMBER_INVITED',
        details: JSON.stringify({ email: 'sarah.chen@socialhubpro.com', role: 'MANAGER' }),
        ipAddress: '192.168.1.104',
      },
    ],
  });

  console.log('✅ Seed completed successfully!');
  console.log('User: alex.morgan@socialhubpro.com / Password: Password123!');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

