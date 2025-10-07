import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

// Mark route as dynamic
export const dynamic = 'force-dynamic';

/**
 * POST /api/exams/submit
 * Submit exam answers and calculate score
 * Body: { courseId: string, answers: { questionId: string, answer: string }[] }
 */
export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      console.log("[EXAM-SUBMIT] Unauthorized access attempt");
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { courseId, answers } = await req.json();

    console.log("[EXAM-SUBMIT] Request from user:", userId, "for course:", courseId);
    console.log("[EXAM-SUBMIT] Number of answers submitted:", answers?.length);

    if (!courseId || !answers || !Array.isArray(answers)) {
      console.error("[EXAM-SUBMIT] Invalid request data");
      return NextResponse.json(
        { error: "Invalid request. courseId and answers array are required" },
        { status: 400 }
      );
    }

    // Verify user is enrolled in the course
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
      include: {
        course: {
          include: {
            lessons: {
              where: { isPublished: true },
            },
          },
        },
        lessonProgress: true,
      },
    });

    if (!enrollment) {
      return NextResponse.json(
        { error: "You are not enrolled in this course" },
        { status: 403 }
      );
    }

    // Check if all lessons are completed
    const totalLessons = enrollment.course.lessons.length;
    const completedLessons = enrollment.lessonProgress.filter(
      (lp) => lp.isCompleted
    ).length;

    if (completedLessons < totalLessons) {
      return NextResponse.json(
        {
          error: "You must complete all lessons before taking the exam",
          progress: {
            completed: completedLessons,
            total: totalLessons,
          },
        },
        { status: 403 }
      );
    }

    // Get all exam questions with answers
    const questions = await prisma.examQuestion.findMany({
      where: { courseId },
    });

    console.log(`[EXAM-SUBMIT] Found ${questions.length} questions in database`);

    if (questions.length === 0) {
      console.error(`[EXAM-SUBMIT] CRITICAL: No exam questions found for course ${courseId}`);
      return NextResponse.json(
        { error: "No exam questions found for this course" },
        { status: 404 }
      );
    }

    // Calculate score
    let correctAnswers = 0;
    const questionResults = [];

    for (const userAnswer of answers) {
      const question = questions.find((q) => q.id === userAnswer.questionId);
      
      if (question) {
        const isCorrect = question.answer.trim().toLowerCase() === userAnswer.answer.trim().toLowerCase();
        
        if (isCorrect) {
          correctAnswers++;
        }

        questionResults.push({
          questionId: question.id,
          userAnswer: userAnswer.answer,
          correctAnswer: question.answer,
          isCorrect,
        });
      }
    }

    const totalQuestions = questions.length;
    const percentageScore = (correctAnswers / totalQuestions) * 100;
    const score = Math.round((correctAnswers / totalQuestions) * 1000); // Score out of 1000
    const passed = score >= 800; // Pass if score >= 800

    console.log(`[EXAM-SUBMIT] Score: ${score}/1000 (${percentageScore}%) - Passed: ${passed}`);
    console.log(`[EXAM-SUBMIT] Correct: ${correctAnswers}/${totalQuestions}`);

    // Save exam result
    const examResult = await prisma.examResult.create({
      data: {
        userId,
        courseId,
        score,
        totalQuestions,
        correctAnswers,
        passed,
        answers: questionResults,
      },
    });

    // If passed, create or update certificate
    if (passed) {
      const existingCertificate = await prisma.certificate.findUnique({
        where: {
          userId_courseId: {
            userId,
            courseId,
          },
        },
      });

      if (!existingCertificate) {
        await prisma.certificate.create({
          data: {
            userId,
            courseId,
            title: `Certificate of Completion - ${enrollment.course.title}`,
            description: `Successfully completed ${enrollment.course.title} with a score of ${score}/1000`,
            examScore: score,
            issuedAt: new Date(),
          },
        });
      } else {
        // Update certificate with new score if higher
        if (!existingCertificate.examScore || score > existingCertificate.examScore) {
          await prisma.certificate.update({
            where: {
              userId_courseId: {
                userId,
                courseId,
              },
            },
            data: {
              examScore: score,
              description: `Successfully completed ${enrollment.course.title} with a score of ${score}/1000`,
              issuedAt: new Date(),
            },
          });
        }
      }

      // Update enrollment completion status
      await prisma.enrollment.update({
        where: {
          userId_courseId: {
            userId,
            courseId,
          },
        },
        data: {
          completedAt: new Date(),
          progress: 100,
        },
      });
    }

    return NextResponse.json({
      success: true,
      result: {
        id: examResult.id,
        score,
        totalQuestions,
        correctAnswers,
        incorrectAnswers: totalQuestions - correctAnswers,
        percentageScore: parseFloat(percentageScore.toFixed(2)),
        passed,
        passThreshold: 800,
        message: passed 
          ? `Congratulations! You passed with a score of ${score}/1000` 
          : `You scored ${score}/1000. You need at least 800/1000 to pass. Keep learning!`,
      },
      certificate: passed ? {
        available: true,
        url: `/courses/${courseId}/certificate`,
      } : null,
    });

  } catch (error: any) {
    console.error("[EXAM-SUBMIT] Error submitting exam:", error);
    console.error("[EXAM-SUBMIT] Stack trace:", error.stack);
    return NextResponse.json(
      { 
        error: "Failed to submit exam", 
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/exams/submit?courseId=xxx
 * Get exam results for a user and course
 */
export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get("courseId");

    if (!courseId) {
      return NextResponse.json(
        { error: "Course ID is required" },
        { status: 400 }
      );
    }

    // Get exam results for this user and course
    const results = await prisma.examResult.findMany({
      where: {
        userId,
        courseId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Get best result
    const bestResult = results.reduce((best, current) => {
      return current.score > (best?.score || 0) ? current : best;
    }, results[0]);

    return NextResponse.json({
      results,
      bestResult: bestResult ? {
        id: bestResult.id,
        score: bestResult.score,
        totalQuestions: bestResult.totalQuestions,
        correctAnswers: bestResult.correctAnswers,
        passed: bestResult.passed,
        createdAt: bestResult.createdAt,
      } : null,
      attempts: results.length,
    });

  } catch (error: any) {
    console.error("Error fetching exam results:", error);
    return NextResponse.json(
      { 
        error: "Failed to fetch exam results", 
        details: error.message 
      },
      { status: 500 }
    );
  }
}
