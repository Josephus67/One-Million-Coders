# Ghana Tech Online - Learning Management System

A comprehensive online learning platform built with Next.js, TypeScript, and PostgreSQL.

## 🚀 Quick Start

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Production Deployment

```bash
npm run build
npm start
```

## ⚠️ Important: Exam System Setup

After deploying to production, you **MUST** seed the exam questions:

```bash
npm run db:seed-production
```

Or use the deployment script:

```bash
./deploy-exam-questions.sh
```

**📖 For detailed exam deployment instructions, see [EXAM_DEPLOYMENT_FIX.md](./EXAM_DEPLOYMENT_FIX.md)**

## 📚 Features

- Course management with lessons and videos
- User authentication with Clerk
- Exam system with certificate generation
- Progress tracking
- Notifications system
- Admin dashboard

## 🔧 Environment Variables

Required environment variables:

- `DATABASE_URL` - PostgreSQL connection string
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Clerk public key
- `CLERK_SECRET_KEY` - Clerk secret key
- `WEBHOOK_SECRET` - Clerk webhook secret

See `.env.example` for full list.
  