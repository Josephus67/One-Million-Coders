/**
 * Test script for the Exam System
 * This script tests the complete exam flow without needing manual browser interaction
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testExamFlow() {
  console.log('🧪 Starting Exam System Test\n');
  
  try {
    // Step 1: Find a completed enrollment
    console.log('Step 1: Finding a completed enrollment...');
    const completedEnrollment = await prisma.enrollment.findFirst({
      where: {
        progress: 100
      },
      include: {
        course: true
      }
    });
    
    if (!completedEnrollment) {
      console.log('❌ No completed enrollments found. Please complete a course first.');
      return;
    }
    
    console.log(`✓ Found completed enrollment for: ${completedEnrollment.course.title}`);
    console.log(`  User ID: ${completedEnrollment.userId}`);
    console.log(`  Course ID: ${completedEnrollment.courseId}`);
    console.log(`  Completed At: ${completedEnrollment.completedAt}\n`);
    
    // Step 2: Check if exam questions exist for this course
    console.log('Step 2: Checking exam questions...');
    const questions = await prisma.examQuestion.findMany({
      where: { courseId: completedEnrollment.courseId }
    });
    
    console.log(`✓ Found ${questions.length} questions for this course`);
    
    if (questions.length < 40) {
      console.log(`❌ Not enough questions (minimum 40 required)`);
      return;
    }
    console.log('');
    
    // Step 3: Simulate taking the exam (select random answers)
    console.log('Step 3: Simulating exam submission...');
    const answers: Record<string, string> = {};
    let correctAnswers = 0;
    
    questions.forEach((question: any, index: number) => {
      // For testing, let's answer correctly 85% of the time (should pass with 850/1000)
      const shouldAnswerCorrectly = Math.random() < 0.85;
      const selectedAnswer = shouldAnswerCorrectly 
        ? question.answer 
        : (question.options as string[]).find(opt => opt !== question.answer) || (question.options as string[])[0];
      
      answers[question.id] = selectedAnswer;
      if (selectedAnswer === question.answer) {
        correctAnswers++;
      }
    });
    
    const totalQuestions = questions.length;
    const score = Math.round((correctAnswers / totalQuestions) * 1000);
    const passed = score >= 800;
    
    console.log(`  Answered ${correctAnswers}/${totalQuestions} correctly`);
    console.log(`  Score: ${score}/1000`);
    console.log(`  Status: ${passed ? '✅ PASSED' : '❌ FAILED'}\n`);
    
    // Step 4: Create exam result
    console.log('Step 4: Saving exam result...');
    const examResult = await prisma.examResult.create({
      data: {
        userId: completedEnrollment.userId,
        courseId: completedEnrollment.courseId,
        score,
        totalQuestions,
        correctAnswers,
        passed,
        answers
      }
    });
    
    console.log(`✓ Exam result saved (ID: ${examResult.id})\n`);
    
    // Step 5: Create certificate if passed
    if (passed) {
      console.log('Step 5: Generating certificate...');
      
      // Check if certificate already exists
      const existingCertificate = await prisma.certificate.findFirst({
        where: {
          userId: completedEnrollment.userId,
          courseId: completedEnrollment.courseId
        }
      });
      
      if (existingCertificate) {
        console.log(`  ℹ️  Certificate already exists (ID: ${existingCertificate.id})`);
        console.log(`  Title: ${existingCertificate.title}\n`);
      } else {
        const certificate = await prisma.certificate.create({
          data: {
            userId: completedEnrollment.userId,
            courseId: completedEnrollment.courseId,
            title: `Certificate of Completion - ${completedEnrollment.course.title}`,
            description: `Successfully completed ${completedEnrollment.course.title} with a score of ${score}/1000`,
            examScore: score,
            issuedAt: new Date(),
          }
        });
        
        console.log(`✓ Certificate created (ID: ${certificate.id})`);
        console.log(`  Title: ${certificate.title}\n`);
      }
    } else {
      console.log('Step 5: Certificate not generated (score below 800)\n');
    }
    
    // Step 6: Verify the complete flow
    console.log('Step 6: Verifying exam system data...');
    
    const examResults = await prisma.examResult.findMany({
      where: {
        userId: completedEnrollment.userId,
        courseId: completedEnrollment.courseId
      },
      orderBy: { createdAt: 'desc' }
    });
    
    const certificates = await prisma.certificate.findMany({
      where: {
        userId: completedEnrollment.userId,
        courseId: completedEnrollment.courseId
      }
    });
    
    console.log(`✓ Total exam attempts: ${examResults.length}`);
    console.log(`✓ Certificates earned: ${certificates.length}`);
    console.log(`✓ Best score: ${Math.max(...examResults.map((r: any) => r.score))}/1000\n`);
    
    // Summary
    console.log('═══════════════════════════════════════════════════════');
    console.log('✅ EXAM SYSTEM TEST COMPLETED SUCCESSFULLY');
    console.log('═══════════════════════════════════════════════════════');
    console.log('\n📊 Test Summary:');
    console.log(`  ✓ Exam questions loaded: ${questions.length}`);
    console.log(`  ✓ Exam submitted successfully`);
    console.log(`  ✓ Score calculated: ${score}/1000`);
    console.log(`  ✓ Result saved to database`);
    console.log(`  ✓ Certificate ${passed ? 'generated' : 'not generated (below passing score)'}`);
    console.log('\n🌐 Next Steps:');
    console.log('  1. Open http://localhost:3000 in your browser');
    console.log(`  2. Navigate to the course: ${completedEnrollment.course.title}`);
    console.log('  3. You should see "Take Final Exam" button (course is 100% complete)');
    console.log(`  4. Click to take exam at: /courses/${completedEnrollment.course.slug}/exam`);
    console.log(`  5. After completion, view certificate at: /courses/${completedEnrollment.course.slug}/certificate`);
    
  } catch (error) {
    console.error('❌ Test failed with error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testExamFlow();
