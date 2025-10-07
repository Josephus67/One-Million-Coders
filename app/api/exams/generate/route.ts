import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

/**
 * POST /api/exams/generate
 * Fetch exam questions for a course from database
 * Body: { courseId: string }
 * 
 * Note: Questions should be pre-populated in the database
 * Use the seed script to add questions for your courses
 */
export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { courseId } = await req.json();

    if (!courseId) {
      return NextResponse.json(
        { error: "Course ID is required" },
        { status: 400 }
      );
    }

    // Get course details
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: {
        id: true,
        title: true,
      },
    });

    if (!course) {
      return NextResponse.json(
        { error: "Course not found" },
        { status: 404 }
      );
    }

    // Fetch questions from database
    const questions = await prisma.examQuestion.findMany({
      where: { courseId },
    });

    if (questions.length === 0) {
      return NextResponse.json(
        { 
          error: "No exam questions found for this course", 
          message: "Please contact administrator to add exam questions for this course",
          courseTitle: course.title,
        },
        { status: 404 }
      );
    }

    if (questions.length < 40) {
      return NextResponse.json(
        { 
          error: "Insufficient exam questions", 
          message: `Only ${questions.length} questions found. Minimum 40 required.`,
          courseTitle: course.title,
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      questions,
      message: `Found ${questions.length} questions for ${course.title}`,
      count: questions.length,
    });

  } catch (error: any) {
    console.error("Error fetching exam questions:", error);
    return NextResponse.json(
      { 
        error: "Failed to fetch exam questions", 
        details: error.message 
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/exams/generate?courseId=xxx
 * Get existing exam questions for a course
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

    // Get questions for this course
    const questions = await prisma.examQuestion.findMany({
      where: { courseId },
      select: {
        id: true,
        text: true,
        options: true,
        createdAt: true,
        // Don't include the answer in GET request
      },
    });

    return NextResponse.json({
      questions,
      count: questions.length,
    });

  } catch (error: any) {
    console.error("Error fetching exam questions:", error);
    return NextResponse.json(
      { 
        error: "Failed to fetch exam questions", 
        details: error.message 
      },
      { status: 500 }
    );
  }
}


