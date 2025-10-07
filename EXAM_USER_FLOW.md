# 📚 Where and How Users Take Exams

## User Journey to Taking an Exam

### Step 1: Complete All Course Lessons
**Location**: `/courses/[course-slug]/learn/[lesson-id]`

Users must first complete **ALL lessons** in a course. The system tracks lesson completion automatically.

### Step 2: "Take Final Exam" Button Appears
**Locations where button appears**:

#### A. In the Course Learning Page Header (Top Right)
```
📍 Location: /courses/[course-slug]/learn/[lesson-id]
Position: Top navigation bar, right side
```

When all lessons are completed, a prominent button appears:
```
┌─────────────────────────────────────────────────────────┐
│ ← Course Title                [⭐ Take Final Exam] 📊    │
└─────────────────────────────────────────────────────────┘
```

#### B. In the Sidebar Course Content Panel
```
📍 Location: Left sidebar of learning page
Position: Below progress tracker
```

```
┌────────────────────────┐
│  Course Content        │
│  ─────────────────────│
│  15 lessons            │
│  Progress: 100%        │
│  15 completed          │
│                        │
│  [✓ Take Final Exam]   │ ← Appears here
└────────────────────────┘
```

**Code Reference**:
```tsx
// File: src/components/CourseLearningPage.tsx
// Lines: 211-217 and 266-274

{allLessonsCompleted && (
  <Button
    onClick={() => window.location.href = `/courses/${course.slug}/exam`}
    className="bg-gradient-to-r from-green-600 to-blue-600"
  >
    <Star className="w-4 h-4 mr-2" />
    Take Final Exam
  </Button>
)}
```

### Step 3: Navigate to Exam Page
**URL**: `/courses/[course-slug]/exam`

**Example**: `/courses/introduction-to-python/exam`

When the user clicks "Take Final Exam", they are redirected to the exam page.

### Step 4: Exam Page Overview
**File**: `app/courses/[slug]/exam/page.tsx` (Server Component)
**Client Component**: `app/courses/[slug]/exam/exam-client.tsx`

#### Pre-Exam Screen Shows:
1. **Course Information**
   - Course title
   - Instructor name
   - Category

2. **Requirements Check**
   - ✅ Completion status (must be 100%)
   - ⚠️ Warning if lessons incomplete

3. **Exam Information**
   - Number of questions: 40
   - Time limit: 90 minutes
   - Passing score: 70%
   - Number of attempts allowed: Unlimited

4. **Previous Results** (if any)
   - Shows history of previous attempts
   - Displays scores and pass/fail status

5. **"Start Exam" Button**
   - Large, prominent button to begin the exam

```
┌───────────────────────────────────────────────────────┐
│                                                       │
│  📚 Final Exam: Introduction to Python                │
│                                                       │
│  ℹ️ Exam Information                                  │
│  • 40 multiple-choice questions                      │
│  • 90 minutes time limit                             │
│  • 70% passing score                                 │
│  • Review your course material before starting       │
│                                                       │
│  ✅ Progress: 15/15 lessons completed (100%)         │
│                                                       │
│  [Start Exam] ─────────────────────────────────────  │
│                                                       │
└───────────────────────────────────────────────────────┘
```

### Step 5: Taking the Exam

#### Exam Interface Features:

1. **Timer** (Top of page)
   - Countdown timer: HH:MM:SS format
   - Auto-submits when time expires
   - Changes color when time is running low

2. **Progress Indicator**
   - Shows current question number (e.g., "Question 5 of 40")
   - Progress bar showing completion percentage

3. **Question Display**
   - Clear question text
   - Multiple choice options (radio buttons)
   - Only one answer can be selected

4. **Navigation**
   - "Previous" button - Go to previous question
   - "Next" button - Go to next question
   - "Submit Exam" button - Appears on last question

5. **Question Navigation Panel**
   - Shows all 40 questions as numbered buttons
   - Color coding:
     - ✅ Green = Answered
     - ⚪ Gray = Not answered
   - Can jump to any question

```
┌──────────────────────────────────────────────────────────┐
│  ⏱️ Time Remaining: 01:29:45          Question 5 of 40   │
│  ═══════════════════════════════════════════════════════ │
│                                                           │
│  Q5: What is the correct syntax to output "Hello"?       │
│                                                           │
│  ○ print("Hello")          ← Radio buttons               │
│  ○ echo("Hello")                                         │
│  ○ console.log("Hello")                                  │
│  ○ printf("Hello")                                       │
│                                                           │
│  [← Previous]                            [Next →]        │
│                                                           │
│  Quick Navigation:                                       │
│  [1] [2] [3] [4] [✓5] [6] [7] ... [40]                  │
│                                                           │
└──────────────────────────────────────────────────────────┘
```

### Step 6: Submit Exam

On the last question, the "Next" button changes to "Submit Exam":

```
┌──────────────────────────────────────────────────────────┐
│  Question 40 of 40                                       │
│  ═══════════════════════════════════════════════════════ │
│                                                           │
│  [Your final question here]                              │
│                                                           │
│  [← Previous]                      [🏆 Submit Exam]      │
│                                                           │
│  ⚠️ Make sure all questions are answered!                │
│     Unanswered: 0/40                                     │
└──────────────────────────────────────────────────────────┘
```

### Step 7: Exam Results

After submission, results are displayed immediately:

#### If PASSED (≥70%):
```
┌──────────────────────────────────────────────────────────┐
│                                                           │
│  🎉 Congratulations! You Passed!                         │
│                                                           │
│  Your Score: 85%                                         │
│  Passing Score: 70%                                      │
│                                                           │
│  ✅ Correct Answers: 34/40                               │
│  ❌ Incorrect Answers: 6/40                              │
│                                                           │
│  📜 You've earned your certificate!                      │
│                                                           │
│  [View Certificate] [Back to Course]                     │
│                                                           │
└──────────────────────────────────────────────────────────┘
```

#### If FAILED (<70%):
```
┌──────────────────────────────────────────────────────────┐
│                                                           │
│  📚 Keep Learning!                                        │
│                                                           │
│  Your Score: 65%                                         │
│  Passing Score: 70%                                      │
│                                                           │
│  ✅ Correct Answers: 26/40                               │
│  ❌ Incorrect Answers: 14/40                             │
│                                                           │
│  💡 Review the course material and try again             │
│                                                           │
│  [Retake Exam] [Back to Course]                          │
│                                                           │
└──────────────────────────────────────────────────────────┘
```

### Step 8: Certificate (If Passed)

**URL**: `/courses/[course-slug]/certificate`

If the user passed the exam, they can:
1. Click "View Certificate" button
2. See their official course completion certificate
3. Download certificate as PDF
4. Share certificate on social media

```
┌──────────────────────────────────────────────────────────┐
│                   CERTIFICATE OF COMPLETION               │
│                                                           │
│  This is to certify that                                 │
│  [Student Name]                                          │
│  has successfully completed                              │
│                                                           │
│  [Course Title]                                          │
│                                                           │
│  Score: 85%                                              │
│  Date: October 7, 2025                                   │
│                                                           │
│  [Download PDF] [Share] [Back to Dashboard]              │
└──────────────────────────────────────────────────────────┘
```

## Complete URL Flow

```
1. Learning Page
   └─→ /courses/[slug]/learn/[lesson-id]
       └─→ Complete all lessons
           └─→ Click "Take Final Exam" button

2. Exam Page
   └─→ /courses/[slug]/exam
       └─→ Click "Start Exam"
           └─→ Answer 40 questions
               └─→ Click "Submit Exam"
                   └─→ View Results

3. Certificate Page (if passed)
   └─→ /courses/[slug]/certificate
       └─→ View/Download certificate
```

## Key Files in the Exam System

| File | Purpose | Type |
|------|---------|------|
| `src/components/CourseLearningPage.tsx` | Shows "Take Final Exam" button | Client Component |
| `app/courses/[slug]/exam/page.tsx` | Exam page server logic | Server Component |
| `app/courses/[slug]/exam/exam-client.tsx` | Exam interface & interaction | Client Component |
| `app/api/exams/generate/route.ts` | Fetch exam questions | API Route |
| `app/api/exams/submit/route.ts` | Submit and grade exam | API Route |
| `app/courses/[slug]/certificate/page.tsx` | Certificate display | Server Component |

## Important Notes

### Requirements to See Exam Button:
✅ User must be **enrolled** in the course  
✅ User must complete **ALL lessons** (100% completion)  
✅ User must be **authenticated** (logged in)

### Exam Features:
- ⏱️ **90-minute time limit** (auto-submit when time expires)
- 📝 **40 multiple-choice questions**
- 🎯 **70% passing score required**
- 🔄 **Unlimited retakes** (can retake if failed)
- 📊 **Previous results** are saved and displayed
- 📜 **Certificate generated** automatically upon passing

### Technical Details:
- Questions are fetched from the database
- Questions are pre-seeded for each course
- Exam answers are validated server-side
- Results are stored in the database
- Certificate generation happens automatically
- All data is persisted across sessions

## Troubleshooting

### "Take Final Exam" Button Not Showing?
**Check:**
1. Are ALL lessons marked as completed?
2. Is the user enrolled in the course?
3. Is the user logged in?

### Can't Access Exam Page?
**Check:**
1. User must be enrolled: `/api/enrollments`
2. Course must exist with valid slug
3. User must be authenticated

### Questions Not Loading?
**Check:**
1. Database has exam questions seeded
2. Run: `npx ts-node prisma/seed-exam-questions.ts`
3. Check API: `/api/exams/generate?courseId=[id]`

---

**Summary**: Users access exams from the course learning page after completing all lessons. The exam button appears in two prominent locations (header and sidebar), and clicking it takes them to a dedicated exam page with a full-featured testing interface.
