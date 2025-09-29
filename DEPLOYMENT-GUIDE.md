# 🚀 Production Deployment Checklist

## After setting up your cloud database:

### 1. Update your environment variables
Replace the DATABASE_URL in your `.env.local` and add to Vercel:

```bash
# In .env.local (for local development)
DATABASE_URL="your-production-database-url"

# In Vercel dashboard (Settings → Environment Variables):
DATABASE_URL = your-production-database-url
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = your-clerk-publishable-key
CLERK_SECRET_KEY = your-clerk-secret-key
NEXT_PUBLIC_CLERK_SIGN_IN_URL = /sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL = /sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL = /dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL = /dashboard
WEBHOOK_SECRET = your-clerk-webhook-secret
APP_URL = https://your-app-name.vercel.app
```

### 2. Deploy database schema
Run the deployment script:
```bash
export DATABASE_URL="your-production-database-url"
./deploy-db.sh
```

Or manually:
```bash
npx prisma migrate deploy
npx prisma db seed  # optional - adds sample data
```

### 3. Redeploy on Vercel
After setting environment variables:
```bash
git add .
git commit -m "Configure production environment"
git push
```

### 4. Test authentication
- Visit your deployed app
- Try signing up with email/password
- Try signing in with Google
- Check if user data is saved in your database

## Quick Database Options:

### Option 1: Neon (Recommended)
1. Go to https://neon.tech
2. Sign up and create project
3. Copy connection string
4. It includes `?sslmode=require` automatically

### Option 2: Supabase
1. Go to https://supabase.com
2. Create project
3. Go to Settings → Database
4. Copy connection string (use "Connection pooling" URL for better performance)

### Option 3: Railway
1. Go to https://railway.app
2. Create project → Add PostgreSQL
3. Copy DATABASE_URL from variables tab

---

💡 **Pro tip:** Google OAuth often resolves authentication issues faster than debugging credential-based auth, so prioritize setting it up!