#!/bin/bash

# Test Exam System Script
# This script helps verify the exam system is working correctly

echo "🧪 Ghana Tech Online - Exam System Test"
echo "========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
  echo -e "${RED}❌ ERROR: DATABASE_URL environment variable is not set${NC}"
  echo "Set it with: export DATABASE_URL='your-database-url'"
  exit 1
fi

echo -e "${GREEN}✓ Database URL configured${NC}"
echo ""

# Test 1: Check database connection
echo "Test 1: Database Connection"
echo "----------------------------"
npx prisma db execute --stdin <<EOF
SELECT 1;
EOF

if [ $? -eq 0 ]; then
  echo -e "${GREEN}✓ Database connection successful${NC}"
else
  echo -e "${RED}❌ Database connection failed${NC}"
  exit 1
fi
echo ""

# Test 2: Check if courses exist
echo "Test 2: Checking Courses"
echo "------------------------"
COURSE_COUNT=$(npx prisma db execute --stdin <<EOF
SELECT COUNT(*) FROM courses;
EOF
)

if [ $? -eq 0 ]; then
  echo -e "${GREEN}✓ Courses table accessible${NC}"
  echo "   Found courses in database"
else
  echo -e "${RED}❌ Cannot access courses table${NC}"
  exit 1
fi
echo ""

# Test 3: Check exam questions
echo "Test 3: Checking Exam Questions"
echo "--------------------------------"
echo "Querying exam questions by course..."

npx prisma db execute --stdin <<'EOF'
SELECT 
  c.title as course_title,
  c.slug as course_slug,
  COUNT(eq.id) as question_count,
  CASE 
    WHEN COUNT(eq.id) >= 40 THEN 'READY ✓'
    WHEN COUNT(eq.id) > 0 THEN 'INSUFFICIENT ⚠️'
    ELSE 'MISSING ❌'
  END as status
FROM courses c
LEFT JOIN exam_questions eq ON c.id = eq."courseId"
GROUP BY c.id, c.title, c.slug
ORDER BY question_count DESC;
EOF

if [ $? -eq 0 ]; then
  echo -e "${GREEN}✓ Exam questions query successful${NC}"
else
  echo -e "${RED}❌ Cannot query exam questions${NC}"
  exit 1
fi
echo ""

# Test 4: Check for courses with insufficient questions
echo "Test 4: Checking for Issues"
echo "----------------------------"

INSUFFICIENT=$(npx prisma db execute --stdin <<'EOF'
SELECT COUNT(*) FROM (
  SELECT c.id
  FROM courses c
  LEFT JOIN exam_questions eq ON c.id = eq."courseId"
  GROUP BY c.id
  HAVING COUNT(eq.id) < 40
) as insufficient_courses;
EOF
)

if [ "$INSUFFICIENT" -gt "0" ]; then
  echo -e "${YELLOW}⚠️  Warning: $INSUFFICIENT course(s) have insufficient exam questions${NC}"
  echo "   Run: npm run db:seed-exams"
else
  echo -e "${GREEN}✓ All courses have sufficient exam questions${NC}"
fi
echo ""

# Summary
echo "========================================="
echo "Test Summary"
echo "========================================="
echo -e "${GREEN}✓ Database connection working${NC}"
echo -e "${GREEN}✓ Tables accessible${NC}"

if [ "$INSUFFICIENT" -gt "0" ]; then
  echo -e "${YELLOW}⚠️  Some courses need more exam questions${NC}"
  echo ""
  echo "Next Steps:"
  echo "1. Run: npm run db:seed-exams"
  echo "2. Or run: ./deploy-exam-questions.sh"
else
  echo -e "${GREEN}✓ All exam questions seeded${NC}"
  echo ""
  echo "Next Steps:"
  echo "1. Start the dev server: npm run dev"
  echo "2. Complete a course"
  echo "3. Try taking an exam"
fi
echo ""
