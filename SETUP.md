# CodePost Setup Guide

## Prerequisites

- Node.js 18+
- PostgreSQL database
- GitHub OAuth App

## 1. Environment Variables

Copy `.env` and fill in your values:

```
DATABASE_URL="postgresql://user:password@host:5432/codepost"

GITHUB_CLIENT_ID="your_github_oauth_app_client_id"
GITHUB_CLIENT_SECRET="your_github_oauth_app_secret"

AUTH_SECRET="run: openssl rand -base64 32"
NEXTAUTH_URL="http://localhost:3000"
```

## 2. GitHub OAuth App

1. Go to https://github.com/settings/developers → "New OAuth App"
2. **Application name**: CodePost
3. **Homepage URL**: `http://localhost:3000`
4. **Authorization callback URL**: `http://localhost:3000/api/auth/callback/github`
5. Copy the Client ID and Secret into `.env`

## 3. Database Setup

```bash
# Apply schema migrations
npx prisma migrate dev --name init

# Or push schema directly (no migration history)
npx prisma db push
```

## 4. Run Development Server

```bash
npm run dev
```

Open http://localhost:3000

## 5. Production Build

```bash
npm run build
npm start
```

## Architecture

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── auth/          # NextAuth handler
│   │   ├── cards/         # Card CRUD
│   │   ├── gallery/       # Public gallery + likes
│   │   └── github/        # GitHub data sync
│   ├── (dashboard)/       # Protected dashboard
│   ├── gallery/           # Public gallery page
│   └── [username]/        # Public profile pages
├── components/
│   ├── card/              # Card rendering components
│   │   ├── CardCanvas.tsx # Main card renderer (5 themes)
│   │   ├── ContributionHeatmap.tsx
│   │   ├── ProfileHeader.tsx
│   │   ├── StatsOverview.tsx
│   │   ├── TechStack.tsx
│   │   └── TopProjects.tsx
│   ├── editor/            # Customization panel
│   │   ├── ThemeSelector.tsx
│   │   ├── ComponentToggle.tsx
│   │   ├── LayoutControls.tsx
│   │   └── ExportPanel.tsx
│   └── layout/            # Navbar, SessionProvider
├── lib/
│   ├── auth.ts            # NextAuth v5 config
│   ├── github.ts          # GitHub API + mock data
│   ├── prisma.ts          # Prisma client (v7 + pg adapter)
│   ├── store.ts           # Zustand card config store
│   ├── themes.ts          # 5 theme definitions
│   └── utils.ts           # Helpers
└── types/
    ├── index.ts           # All app types
    └── next-auth.d.ts     # Session type augmentation
```

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Auth**: NextAuth v5 (GitHub OAuth)
- **Database**: PostgreSQL via Prisma v7 + pg adapter
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **State**: Zustand
- **GitHub API**: Octokit + GraphQL
- **Export**: html2canvas + jsPDF
