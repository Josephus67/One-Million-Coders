#!/bin/bash

# Production Database Deployment Script
echo "🚀 Deploying database schema to production..."

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
  echo "❌ ERROR: DATABASE_URL environment variable is not set"
  echo "Please set your production database URL first:"
  echo "export DATABASE_URL='your-production-database-url'"
  exit 1
fi

echo "📊 Generating Prisma client..."
npx prisma generate

echo "🔄 Running database migrations..."
npx prisma migrate deploy

echo "🌱 Seeding database (optional)..."
read -p "Do you want to seed the database with sample data? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]
then
    npx prisma db seed
fi

echo "✅ Database deployment complete!"
echo "🔍 You can view your database with: npx prisma studio"