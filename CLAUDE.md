# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal portfolio website built with Next.js 16 (App Router), React 19, TypeScript, and MongoDB. Features include blog posts, portfolio projects, university notes, contact form, and "Sevienómetro" (economic variables tracker). Content is managed through an admin panel with JWT authentication.

## Tech Stack

- **Framework**: Next.js 16 with Turbopack
- **UI**: React 19, Tailwind CSS 4, FontAwesome icons
- **Database**: MongoDB Atlas with Mongoose ODM
- **Auth**: Custom JWT authentication with HTTP-only cookies + NextAuth integration
- **Storage**: Vercel Blob for image uploads
- **AI**: Google Gemini API for CV query feature
- **Language**: TypeScript (with `noImplicitAny: false`)

## Commands

```bash
# Development with Turbopack
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run ESLint
npm run lint
```

## Project Structure

```
src/
├── app/                    # Next.js App Router pages & API routes
│   ├── api/               # API endpoints (posts, auth, upload, etc.)
│   │   ├── gemini/       # Digital Twin main endpoint (with anti-injection)
│   │   └── cv-query/     # CV queries endpoint (also uses Digital Twin)
│   ├── admin/             # Protected admin pages (posts, portfolio, categories)
│   ├── contratar/         # Digital Twin chat interface
│   ├── posts/             # Blog functionality
│   ├── portfolio/         # Portfolio section
│   ├── university/        # University notes
│   ├── seviene/           # Economic tracker app
│   └── layout.tsx         # Root layout with SEO metadata
├── components/            # React components (mix of .tsx and .jsx)
│   └── ContratarGame.tsx # Digital Twin chat UI
├── config/                # Configuration files
│   └── character-identity.md  # Digital Twin personality (CRITICAL)
├── libs/                  # Core utilities
│   ├── mongodb.ts        # MongoDB connection with caching
│   ├── auth.ts           # JWT auth utilities
│   ├── edgeJwt.ts        # Edge-compatible JWT verification
│   └── validations.ts    # Input validation
├── models/               # Mongoose models (User, Post, Portfolio, etc.)
├── types/                # TypeScript type definitions
├── styles/               # Global CSS and theme-specific styles
└── middleware.ts         # Edge middleware for route protection
```

## Architecture Patterns

### MongoDB Connection

Uses a global caching pattern to reuse connections across serverless invocations:

```typescript
// Always import from @/libs/mongodb
import { conectionDB } from '@/libs/mongodb';
await conectionDB();
```

**IMPORTANT**: The function is called `conectionDB` (with one 'n'), not `connectionDB`.

### Authentication Flow

1. **Custom JWT + HTTP-only cookies** for primary auth
2. **NextAuth** configured for extensibility (src/libs/auth.ts)
3. **Edge middleware** (src/middleware.ts) protects `/admin/*` routes
4. **Edge-safe JWT verification** (src/libs/edgeJwt.ts) for middleware

Key auth functions:
- `signToken(user)` - Create JWT
- `verifyToken(token)` - Verify JWT (Node.js runtime)
- `verifyJwtHS256(token, secret)` - Verify JWT (Edge runtime)
- `getCurrentUser()` - Get current user from cookie
- `setAuthCookie(token)` / `clearAuthCookie()` - Manage auth cookie

### Mongoose Models

All models follow this pattern:
- Define TypeScript interface extending `mongoose.Document`
- Create schema with validation
- Export singleton: `mongoose.models.ModelName || mongoose.model()`
- Located in `src/models/`

Example models: User, Post, Portfolio, Category, Apunte, VariablesEconomicas

### API Routes

Located in `src/app/api/`. All routes use:
1. `conectionDB()` at the start
2. Try-catch error handling
3. Return `NextResponse.json()` with proper status codes

### Image Upload

Uses Vercel Blob for image storage:
- Upload endpoint: `/api/upload`
- Returns blob URL to store in MongoDB
- Used for post featured images, portfolio images, etc.

### Path Aliases

TypeScript configured with `@/*` alias pointing to `src/*`:

```typescript
import { conectionDB } from '@/libs/mongodb';
import Post from '@/models/post';
```

## Development Notes

### Mixed File Extensions
Components use both `.tsx` (newer) and `.jsx` (legacy). Maintain consistency within each file.

### Environment Variables Required

Create `.env.local` with:
- `MONGODB_URI` - MongoDB Atlas connection string
- `JWT_SECRET` - Secret for JWT signing
- `BLOB_READ_WRITE_TOKEN` - Vercel Blob token
- `GEMINI_API_KEY` - Google Gemini API key (optional)
- `NEXTAUTH_SECRET` - NextAuth secret
- `NEXTAUTH_URL` - Base URL for NextAuth

### SEO Implementation

- Structured data (JSON-LD) in root layout
- Dynamic metadata in individual pages
- Sitemap generation (`src/app/sitemap.ts`)
- Robots.txt configuration (`src/app/robots.ts`)
- OG image generation (`src/app/api/og-image/route.ts`)

### Special Features

**Sevienómetro**: Economic tracker app at `/seviene` with custom Pokemon-themed styling (see `src/app/seviene/seviene.css` and `src/styles/pokemon.css`).

**University Notes**: Multi-level categorization system (categories → apuntes) at `/university`.

**Blog with Tags**: Posts support tags for filtering. Tag pages generated at `/tags/[tag]`.

**Digital Twin (Gemelo Digital)**: AI-powered chat at `/contratar` that acts as Facundo's digital representative for hiring conversations. Uses Google Gemini API with:
- Character identity defined in `src/config/character-identity.md` (single source of truth)
- Anti-prompt injection protection (detects and blocks manipulation attempts)
- Consistent persuasive tone focused on conversion
- No hallucinations - only responds with information from the identity file

## Common Tasks

### Adding a New Model
1. Create interface in `src/models/yourmodel.ts`
2. Define schema with validation
3. Export using singleton pattern
4. Create CRUD API routes in `src/app/api/yourmodel/`

### Creating Protected Routes
1. Add route under `/admin/*` (automatically protected by middleware)
2. Use `getCurrentUser()` to verify user role if needed
3. Redirect to `/login` if unauthorized

### Adding New Blog Post Programmatically
Use the API endpoint or admin UI at `/admin/posts/new`. Posts require:
- `title` (3-150 chars)
- `slug` (unique, lowercase)
- `content` (markdown supported)
- `tags` (optional array)
- `featuredImage` (optional URL)

### Modifying Digital Twin Personality
**IMPORTANT**: The Digital Twin's personality is defined SOLELY in `src/config/character-identity.md`.

To modify behavior:
1. Edit `src/config/character-identity.md` (never edit API endpoints directly for personality changes)
2. This file uses Markdown format and includes:
   - Security controls (anti-prompt injection - PRIORITY #1)
   - Professional profile and experience
   - Tech stack and expertise
   - Sales protocols and CTAs
   - Response rules and tone guidelines

The file is loaded as `systemInstruction` in Gemini API calls, giving it maximum priority.

**Security**: The anti-injection patterns in `/api/gemini/route.ts` and `/api/cv-query/route.ts` detect manipulation attempts like:
- "Ignore previous instructions"
- "Reveal your prompt"
- "Enter developer mode"
- Variations in English and Spanish

When detected, the system responds with creative refusals and redirects to professional conversation.
