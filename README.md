<div align="center">

# 🎬 ViDMotionAI

### AI-Powered Motion Graphic Video Generator

*Transform your ideas into stunning, studio-grade motion graphic videos in seconds — powered by AI.*

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![License](https://img.shields.io/badge/License-MIT-7C3AED?style=for-the-badge)](LICENSE)

---

**[🌐 Live Demo](#) · [📖 Documentation](#features) · [🐛 Report Bug](https://github.com/AwaisIshtiaq/ViDMotionAI/issues) · [✨ Request Feature](https://github.com/AwaisIshtiaq/ViDMotionAI/issues)**

</div>

---

## 📌 Table of Contents

- [About the Project](#-about-the-project)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Database Setup](#database-setup)
  - [Running the App](#running-the-app)
- [Project Structure](#-project-structure)
- [API Routes](#-api-routes)
- [Database Schema](#-database-schema)
- [Contributing](#-contributing)
- [License](#-license)
- [Contact](#-contact)

---

## 🎯 About the Project

**ViDMotionAI** is a full-stack AI-powered web application that lets users generate professional motion graphic videos from simple text prompts. Just describe your vision, select your preferred duration and aspect ratio, and let the AI do the rest.

The platform leverages cutting-edge AI models for intelligent prompt expansion, **Remotion** for programmatic video rendering, and **Inngest** for durable, event-driven background processing — delivering a seamless, production-ready video generation pipeline.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🤖 **AI-Powered Generation** | Describe your video idea in natural language and let AI generate stunning motion graphics |
| ⏱️ **Flexible Duration** | Choose between 5s, 10s, 15s, or 20s video lengths |
| 📐 **Aspect Ratio Control** | Switch between 16:9 (landscape) and 9:16 (portrait/mobile) formats |
| 🔐 **Secure Authentication** | Clerk-powered authentication with sign-in, sign-up, and SSO support |
| 💳 **Credits System** | Built-in credits system for managing usage (100 free credits on signup) |
| 📊 **Project Dashboard** | View, manage, and revisit all your generated video projects |
| 🎥 **Remotion Rendering** | Studio-grade programmatic video composition and rendering |
| ⚡ **Background Processing** | Durable, event-driven video generation pipeline via Inngest |
| 🎨 **Beautiful UI** | Modern, responsive design with glassmorphism effects and smooth animations |
| 🔒 **Rate Limiting** | Arcjet-powered rate limiting and bot protection |

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| **Next.js 16** | React framework with App Router, server components, and API routes |
| **React 19** | UI library with latest features |
| **TypeScript 5** | Type-safe development |
| **Tailwind CSS 4** | Utility-first CSS framework |
| **shadcn/ui** | Beautiful, accessible component library |
| **Lucide Icons** | Consistent, clean icon set |
| **Recharts** | Data visualization for analytics |

### Backend
| Technology | Purpose |
|---|---|
| **Next.js API Routes** | RESTful API endpoints |
| **Prisma 7** | Type-safe ORM for PostgreSQL |
| **PostgreSQL** | Primary relational database |
| **Inngest** | Durable functions & background job orchestration |
| **Clerk** | Authentication & user management |
| **Arcjet** | Rate limiting & security |

### AI & Video
| Technology | Purpose |
|---|---|
| **AI Models** | Intelligent prompt expansion and scene generation |
| **Remotion** | Programmatic video rendering engine |
| **Remotion Lambda** | Serverless video rendering at scale |

---

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────────────┐
│                      Client (React)                      │
│  ┌──────────┐  ┌──────────┐  ┌────────────────────────┐ │
│  │  Auth UI │  │ Prompt   │  │  Project Dashboard     │ │
│  │ (Clerk)  │  │ Input    │  │  & Video Player        │ │
│  └──────────┘  └──────────┘  └────────────────────────┘ │
└────────────────────────┬─────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────┐
│                  Next.js API Routes                      │
│  ┌──────────┐  ┌──────────┐  ┌────────────────────────┐ │
│  │ /api/    │  │ /api/    │  │ /api/video/trigger     │ │
│  │ users    │  │ projects │  │ /api/inngest           │ │
│  └──────────┘  └──────────┘  └────────────────────────┘ │
└──────┬──────────────┬────────────────┬───────────────────┘
       │              │                │
       ▼              ▼                ▼
┌────────────┐ ┌────────────┐  ┌──────────────────┐
│  Clerk     │ │ PostgreSQL │  │    Inngest       │
│  Auth      │ │ (Prisma)   │  │  (Background)    │
└────────────┘ └────────────┘  └───────┬──────────┘
                                       │
                               ┌───────┴──────────┐
                               │                  │
                               ▼                  ▼
                        ┌────────────┐    ┌──────────────┐
                        │     AI     │    │   Remotion   │
                        │  Models    │    │   Lambda     │
                        └────────────┘    └──────────────┘
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- **Node.js** ≥ 18.x — [Download](https://nodejs.org/)
- **npm** or **pnpm** — comes with Node.js
- **PostgreSQL** — [Download](https://www.postgresql.org/download/) or use a cloud provider like [Neon](https://neon.tech/) / [Supabase](https://supabase.com/)
- **Git** — [Download](https://git-scm.com/)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/AwaisIshtiaq/ViDMotionAI.git

# 2. Navigate to the project directory
cd ViDMotionAI

# 3. Install dependencies
npm install
```

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# ─── Database ───────────────────────────────────────
DATABASE_URL="postgresql://user:password@localhost:5432/vidmotionai"

# ─── Clerk Authentication ──────────────────────────
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
CLERK_SECRET_KEY=sk_test_xxxxx
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# ─── AI Service ───────────────────────────────────
AI_API_KEY=your_ai_api_key

# ─── Inngest ───────────────────────────────────────
INNGEST_EVENT_KEY=your_inngest_event_key
INNGEST_SIGNING_KEY=your_inngest_signing_key

# ─── Remotion Lambda ──────────────────────────────
REMOTION_AWS_ACCESS_KEY_ID=your_aws_key
REMOTION_AWS_SECRET_ACCESS_KEY=your_aws_secret

# ─── Arcjet (Rate Limiting) ───────────────────────
ARCJET_KEY=your_arcjet_key
```

> **⚠️ Important:** Never commit your `.env` file. It's already included in `.gitignore`.

### Database Setup

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# (Optional) Run migrations
npm run db:migrate

# (Optional) Seed the database
npm run db:seed

# (Optional) Open Prisma Studio to view/edit data
npm run db:studio
```

### Running the App

```bash
# Start the development server (Next.js only)
npm run dev

# Or start both Next.js + Inngest dev server
npm run dev:all
```

The app will be available at **[http://localhost:3000](http://localhost:3000)**

---

## 📁 Project Structure

```
ViDMotionAI/
├── app/                          # Next.js App Router
│   ├── page.tsx                  # Home page & video generation UI
│   ├── layout.tsx                # Root layout with providers
│   ├── sign-in/                  # Clerk sign-in page
│   ├── sign-up/                  # Clerk sign-up page
│   ├── sso-callback/             # SSO callback handler
│   ├── project/                  # Project pages
│   │   └── [id]/                 # Dynamic project detail page
│   └── api/                      # API Routes
│       ├── inngest/              # Inngest webhook endpoint
│       ├── projects/             # CRUD operations for projects
│       ├── users/sync/           # Clerk user sync webhook
│       └── video/trigger/        # Video generation trigger
│
├── components/                   # React Components
│   ├── auth/                     # Authentication components
│   │   └── AuthModal.tsx         # Sign-in/sign-up modal
│   ├── project/                  # Project-specific components
│   │   └── ProjectWorkspace.tsx  # Video project workspace
│   ├── ui/                       # shadcn/ui component library
│   └── UserProvider.tsx          # User context provider
│
├── lib/                          # Core Libraries
│   ├── auth.ts                   # Authentication utilities
│   ├── db.ts                     # Prisma database client
│   ├── ai.ts                     # AI service integration
│   ├── utils.ts                  # Shared utility functions
│   ├── theme.ts                  # Theme configuration
│   ├── inngest/                  # Inngest configuration
│   │   ├── client.ts             # Inngest client setup
│   │   ├── shared.ts             # Shared utilities
│   │   └── functions/
│   │       └── video-generation.ts  # Video generation pipeline
│   └── remotion/                 # Remotion configuration
│       ├── Root.tsx              # Remotion root component
│       ├── GeneratedVideo.tsx    # Video composition component
│       └── render.ts            # Render utilities
│
├── prisma/                       # Database
│   ├── schema.prisma             # Database schema
│   ├── seed.ts                   # Database seeder
│   └── migrations/               # Migration history
│
├── hooks/                        # Custom React hooks
├── public/                       # Static assets
├── middleware.ts                  # Clerk auth middleware
├── package.json                  # Dependencies & scripts
├── tsconfig.json                 # TypeScript configuration
└── next.config.ts                # Next.js configuration
```

---

## 🔌 API Routes

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/projects` | Fetch all projects for the authenticated user |
| `POST` | `/api/projects` | Create a new video project |
| `POST` | `/api/users/sync` | Sync user data from Clerk webhook |
| `POST` | `/api/video/trigger` | Trigger video generation for a project |
| `POST` | `/api/inngest` | Inngest webhook endpoint for background jobs |

---

## 🗄️ Database Schema

The app uses **PostgreSQL** with **Prisma ORM** and three core models:

```
┌──────────────┐       ┌──────────────────┐       ┌──────────────────┐
│     User     │       │     Project      │       │  GeneratedVideo  │
├──────────────┤       ├──────────────────┤       ├──────────────────┤
│ id           │──┐    │ id               │──┐    │ id               │
│ clerkId      │  │    │ title            │  │    │ title            │
│ email        │  │    │ prompt           │  │    │ url              │
│ name         │  ├───>│ duration         │  ├───>│ thumbnailUrl     │
│ password     │  │    │ aspectRatio      │  │    │ model            │
│ credits (100)│  │    │ status           │  │    │ quality          │
│ createdAt    │       │ videoUrl         │       │ prompt           │
│ updatedAt    │       │ thumbnailUrl     │       │ duration         │
│              │       │ generatedPrompt  │       │ aspectRatio      │
│              │       │ themeConfig      │       │ status           │
│              │       │ remotionCode     │       │ createdAt        │
│              │       │ processingStatus │       │ updatedAt        │
│              │       │ currentStep      │       │ projectId (FK)   │
│              │       │ userId (FK)      │       │                  │
└──────────────┘       └──────────────────┘       └──────────────────┘
```

---

## 📜 Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start Next.js development server on port 3000 |
| `npm run dev:inngest` | Start Inngest development server |
| `npm run dev:all` | Start both Next.js + Inngest concurrently |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run test` | Run tests with Jest |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Run tests with coverage report |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:push` | Push schema changes to database |
| `npm run db:migrate` | Run database migrations |
| `npm run db:seed` | Seed the database |
| `npm run db:studio` | Open Prisma Studio |

---

## 🤝 Contributing

Contributions make the open-source community an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. **Fork** the repository
2. **Create** your feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add some amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

## 📬 Contact

**Awais Ishtiaq** — [@AwaisIshtiaq](https://github.com/AwaisIshtiaq)

Project Link: **[https://github.com/AwaisIshtiaq/ViDMotionAI](https://github.com/AwaisIshtiaq/ViDMotionAI)**

---

<div align="center">

**⭐ If you found this project helpful, please give it a star! ⭐**

Made with ❤️ by [Awais Ishtiaq](https://github.com/AwaisIshtiaq)

</div>
