# SOCIALHUB PRO 🚀
### *All Your Social Media. One Powerful Dashboard.*

**SOCIALHUB PRO** is a production-quality, enterprise-grade social media management SaaS platform built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, **Framer Motion**, **Prisma ORM**, **SQLite/PostgreSQL**, and **Recharts**.

---

## 💎 Exclusive Brand Identity & Design System

The visual identity embodies an exclusive luxury aesthetic tailored for high-growth SaaS and enterprise brand leaders:

- **Primary Color:** Deep Luxury Maroon (`#641B32`)
- **Secondary Color:** Burgundy (`#842D49`)
- **Accent Color:** Champagne Gold (`#D6B36A`)
- **Background Light:** `#F8F6F5`
- **Background Dark:** `#100D10`
- **Card Dark:** `#1C171C`
- **Text:** `#252025` / `#F5EEF3`
- **Muted:** `#91858C`
- **Theme Support:** Dark & Light modes with persistent `localStorage` preference and seamless transitions.

---

## 🔑 Demo Access Credentials

The database comes pre-seeded with enterprise accounts ready for instant testing:

| User | Email | Password | Role | 2FA Enforced |
|---|---|---|---|---|
| **Alex Morgan** (VP Marketing) | `alex.morgan@socialhubpro.com` | `Password123!` | `ADMIN` | Yes (Email OTP) |
| **Sarah Chen** (Content Manager) | `sarah.chen@socialhubpro.com` | `Password123!` | `MANAGER` | No (Direct Login) |
| **Marcus Vance** (Creative Lead) | `marcus.vance@socialhubpro.com` | `Password123!` | `EDITOR` | No |
| **Elena Rostova** (Data Scientist) | `elena.rostova@socialhubpro.com` | `Password123!` | `ANALYST` | No |

> **Note on 2FA / OTP:** When logging in with 2FA, the 6-digit cryptographic verification code is displayed in the developer notification banner for immediate one-click testing, as well as logged to the server terminal.

---

## 🌐 Supported Social Media Platforms

Direct official API integration architecture for seven major platforms:

1. **Instagram** (Meta Graph API v20.0 — Feed, Carousels, Reels, and 24h Stories)
2. **Facebook** (Graph API — Pages, Posts, Video, and Reactions)
3. **YouTube** (Google Data API v3 — Shorts, Videos, and Channel Analytics)
4. **LinkedIn** (Community Management API v2 — Company updates, Articles, and Outbound Clicks)
5. **TikTok** (Open Platform v2 — Vertical Video Reels, Sound, and Creator Discovery)
6. **X (Twitter)** (API v2 — Micro-posts, Threads, and Live Impression Metrics)
7. **Pinterest** (API v5 — Idea Pins, Destination URLs, and Outbound Click Attribution)

---

## 🛠️ Complete Feature Matrix

### 1. Main Dashboard (`/dashboard`)
- Real-time aggregated statistics (Total Connected Accounts, 1.2M+ Followers, Impressions, Unique Reach, Engagement Rate).
- Interactive **Recharts** for Follower Growth, Impressions, and Audience Share.
- Best-performing content cards with likes, comments, and shares.
- Immutable audit stream recording server-side actions.

### 2. Social Accounts Connection Center (`/dashboard/accounts`)
- Beautiful modal to connect any of the 7 supported platforms.
- OAuth 2.0 token lifecycle status (Auto-Refreshed, Valid).
- Disconnect and Reconnect workflows with safety confirmations.

### 3. Post Management Studio (`/dashboard/posts` & `/dashboard/posts/create`)
- Multi-channel post composer with real-time character caps (e.g. 280 for X, 2200 for Instagram, 3000 for LinkedIn).
- Live interactive Feed Simulators (Instagram card, LinkedIn update, X tweet preview).
- Smart hashtag suggestions and visual media attachments.
- Publishing modes: Publish Immediately, Schedule for Later, Save as Draft, Submit for Team Approval.

### 4. Stories & Ephemeral Content (`/dashboard/stories`)
- 24-hour visual story studio (9:16 vertical aspect ratio).
- Active live stories, scheduled queue, and archived story analytics.

### 5. Content Master Calendar (`/dashboard/calendar`)
- Monthly and weekly grid views with timezone selector (New York, London, Paris, Tokyo, Dubai).
- Drag-and-drop or slot rescheduling with event detail modals.

### 6. Unified Social Inbox (`/dashboard/inbox`)
- Centralized stream of direct messages, comments, and mentions.
- Live reply interface delivering messages through API endpoints.
- Assign conversations to team members and toggle Open/Resolved status.

### 7. Advanced Analytics Intelligence (`/dashboard/analytics`)
- 7d, 30d, and 90d date range filtering.
- Impression & reach trajectory area charts.
- Algorithmic Audience Presence Heatmap (Day of Week vs Time of Day).
- Age cohort and geographic market distributions.
- One-click CSV export.

### 8. Enterprise Team & RBAC (`/dashboard/team`)
- Invite team members by email with temporary credentials.
- Role management: Admin, Manager, Editor, Analyst.
- Server-side permission enforcement.

### 9. Digital Media Asset Library (`/dashboard/media`)
- High-resolution photography and video clips storage.
- Filter by media type and copy direct CDN URLs.

### 10. Executive Reports & PDF Export (`/dashboard/reports`)
- Compile quarterly and monthly board presentation decks.
- Printable PDF layout and CSV dataset downloads.

### 11. Blog & Thought Leadership CMS (`/dashboard/blog-admin` & `/blog`)
- Public blog listing with categories and search.
- Full markdown article details with author bio and reading time.
- Admin creation studio for new articles.

### 12. Public Website Pages
- **Landing Page (`/`):** Animated navbar, master hero headline, floating preview, platform logos ticker, features grid, how it works, testimonials, pricing plans, and FAQ accordion.
- **Help Center (`/help`):** Knowledge base and setup guides.
- **Enterprise Contact (`/contact`):** Custom solution request form.
- **Privacy Policy (`/privacy`) & Terms (`/terms`):** GDPR & SOC2 compliance.

---

## 🚀 Running the Project

```bash
# 1. Navigate to the project directory
cd socialhub-pro

# 2. Install dependencies (if not already installed)
npm install

# 3. Synchronize database and seed data
npx prisma db push
node prisma/seed.js

# 4. Run production build
npm run build

# 5. Start production server
npm run start
# Local URL: http://localhost:3000
```

