#!/bin/bash

# Production Exam Questions Seeding Script
# Run this script after deploying to production to ensure exam questions exist

echo "🚀 Production Exam Questions Seeding Script"
echo "==========================================="
echo ""

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
  echo "❌ ERROR: DATABASE_URL environment variable is not set"
  echo "Please set your production database URL first"
  exit 1
fi

echo "✓ Database URL found"
echo ""

# Generate Prisma client
echo "📦 Generating Prisma client..."
npx prisma generate
if [ $? -ne 0 ]; then
  echo "❌ Failed to generate Prisma client"
  exit 1
fi
echo "✓ Prisma client generated"
echo ""

# Run migrations (if needed)
echo "🔄 Checking database migrations..."
npx prisma migrate deploy
if [ $? -ne 0 ]; then
  echo "⚠️  Warning: Migration failed or not needed"
fi
echo ""

# Seed exam questions
echo "🌱 Seeding exam questions..."
npx tsx prisma/seed-production.ts
if [ $? -ne 0 ]; then
  echo "❌ Failed to seed exam questions"
  exit 1
fi
echo ""

echo "✅ Production exam questions seeding complete!"
echo ""
echo "📊 Next steps:"
echo "   1. Test the exam functionality in production"
echo "   2. Verify questions appear when taking exams"
echo "   3. Check logs for any errors"
