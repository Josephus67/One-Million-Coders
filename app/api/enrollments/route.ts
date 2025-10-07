import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Mark route as dynamic
export const dynamic = 'force-dynamic';

// GET /api/enrollments - Get user's enrollments
export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get("courseId");

    let whereClause: any = {
      userId: userId,
    };

    if (courseId) {
      whereClause.courseId = courseId;
    }

    // Fetch enrollments
    let enrollments;
    try {
      enrollments = await prisma.enrollment.findMany({
        where: whereClause,
        include: {
          course: {
            select: {
              id: true,
              title: true,
              slug: true,
              image: true,
              instructor: {
                select: { name: true },
              },
            },
          },
        },
        orderBy: { enrolledAt: "desc" },
      });
    } catch (error) {
      console.error("Error fetching enrollments:", error);
      return NextResponse.json({ 
        enrollments: [],
        error: "Database temporarily unavailable. Please try again."
      }, { status: 503 });
    }

    return NextResponse.json({ enrollments });

  } catch (error) {
    console.error("Error fetching enrollments:", error);
    return NextResponse.json(
      { enrollments: [], error: "Failed to fetch enrollments" },
      { status: 500 }
    );
  }
}

// POST /api/enrollments - Enroll in a course
const enrollSchema = z.object({
  courseId: z.string().min(1, "Course ID is required"),
});

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { courseId } = enrollSchema.parse(body);

    // Ensure user exists in database (fallback for webhook issues)
    let user;
    try {
      user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, email: true },
      });
    } catch (error) {
      console.error("Error finding user:", error);
      return NextResponse.json(
        { error: "Database temporarily unavailable. Please try again." },
        { status: 503 }
      );
    }

    if (!user) {
      // Try to create user as fallback (in case webhook failed)
      try {
        user = await prisma.user.create({
          data: {
            id: userId,
            email: `${userId}@clerk.local`, // Placeholder email
            role: "STUDENT",
          },
          select: { id: true, email: true },
        });
      } catch (error) {
        console.error("Error creating user fallback:", error);
        return NextResponse.json(
          { error: "User account not found. Please try signing out and signing back in." },
          { status: 400 }
        );
      }
    }

    // Check if course exists
    let course;
    try {
      course = await prisma.course.findUnique({
        where: { id: courseId },
        select: { id: true, title: true, price: true },
      });
    } catch (error) {
      console.error("Error finding course:", error);
      return NextResponse.json(
        { error: "Database temporarily unavailable. Please try again." },
        { status: 503 }
      );
    }

    if (!course) {
      return NextResponse.json(
        { error: "Course not found" },
        { status: 404 }
      );
    }

    // Check if already enrolled
    let existingEnrollment;
    try {
      existingEnrollment = await prisma.enrollment.findUnique({
        where: {
          userId_courseId: {
            userId: userId,
            courseId: courseId,
          },
        },
      });
    } catch (error) {
      console.error("Error checking existing enrollment:", error);
      return NextResponse.json(
        { error: "Database temporarily unavailable. Please try again." },
        { status: 503 }
      );
    }

    if (existingEnrollment) {
      return NextResponse.json(
        { error: "You are already enrolled in this course" },
        { status: 409 }
      );
    }

    // Create enrollment
    let enrollment;
    try {
      enrollment = await prisma.enrollment.create({
        data: {
          userId: userId,
          courseId: courseId,
          progress: 0,
        },
        include: {
          course: {
            select: {
              id: true,
              title: true,
              slug: true,
              image: true,
              instructor: {
                select: { name: true },
              },
            },
          },
        },
      });
    } catch (error) {
      console.error("Error creating enrollment:", error);
      return NextResponse.json(
        { error: "Failed to enroll in course. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json(enrollment, { status: 201 });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error creating enrollment:", error);
    return NextResponse.json(
      { error: "Failed to enroll in course. Please try again." },
      { status: 500 }
    );
  }
}