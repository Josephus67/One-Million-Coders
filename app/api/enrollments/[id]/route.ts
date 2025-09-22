import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// GET /api/enrollments/[id] - Get specific enrollment
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const enrollment = await prisma.enrollment.findUnique({
      where: { 
        id: params.id,
        userId: session.user.id, // Ensure user owns this enrollment
      },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            slug: true,
            image: true,
            description: true,
            duration: true,
            instructor: {
              select: { name: true },
            },
            _count: {
              select: { lessons: true },
            },
          },
        },
        lessonProgress: {
          include: {
            lesson: {
              select: {
                id: true,
                title: true,
                order: true,
              },
            },
          },
          orderBy: {
            lesson: { order: 'asc' },
          },
        },
      },
    });

    if (!enrollment) {
      return NextResponse.json(
        { error: "Enrollment not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(enrollment);

  } catch (error) {
    console.error("Error fetching enrollment:", error);
    return NextResponse.json(
      { error: "Failed to fetch enrollment" },
      { status: 500 }
    );
  }
}

// PUT /api/enrollments/[id] - Update enrollment
const updateEnrollmentSchema = z.object({
  progress: z.number().min(0).max(100).optional(),
  currentLesson: z.string().optional(),
  completedAt: z.string().datetime().optional().nullable(),
});

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const validatedData = updateEnrollmentSchema.parse(body);

    // Verify enrollment exists and belongs to user
    const existingEnrollment = await prisma.enrollment.findUnique({
      where: { 
        id: params.id,
        userId: session.user.id,
      },
    });

    if (!existingEnrollment) {
      return NextResponse.json(
        { error: "Enrollment not found" },
        { status: 404 }
      );
    }

    // Update enrollment
    const updateData: any = {};
    
    if (validatedData.progress !== undefined) {
      updateData.progress = validatedData.progress;
    }
    
    if (validatedData.currentLesson !== undefined) {
      updateData.currentLesson = validatedData.currentLesson;
    }
    
    if (validatedData.completedAt !== undefined) {
      updateData.completedAt = validatedData.completedAt ? new Date(validatedData.completedAt) : null;
    }

    const updatedEnrollment = await prisma.enrollment.update({
      where: { id: params.id },
      data: updateData,
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

    return NextResponse.json(updatedEnrollment);

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error updating enrollment:", error);
    return NextResponse.json(
      { error: "Failed to update enrollment" },
      { status: 500 }
    );
  }
}

// DELETE /api/enrollments/[id] - Cancel/delete enrollment
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Verify enrollment exists and belongs to user
    const existingEnrollment = await prisma.enrollment.findUnique({
      where: { 
        id: params.id,
        userId: session.user.id,
      },
      include: {
        course: {
          select: { title: true },
        },
      },
    });

    if (!existingEnrollment) {
      return NextResponse.json(
        { error: "Enrollment not found" },
        { status: 404 }
      );
    }

    // Delete related lesson progress first (due to foreign key constraints)
    await prisma.lessonProgress.deleteMany({
      where: { enrollmentId: params.id },
    });

    // Delete the enrollment
    await prisma.enrollment.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ 
      message: `Successfully cancelled enrollment in ${existingEnrollment.course.title}` 
    });

  } catch (error) {
    console.error("Error deleting enrollment:", error);
    return NextResponse.json(
      { error: "Failed to cancel enrollment" },
      { status: 500 }
    );
  }
}