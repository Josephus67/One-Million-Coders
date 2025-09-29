import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma, withDatabaseConnection } from "@/lib/prisma";
import { z } from "zod";

const progressUpdateSchema = z.object({
  lessonId: z.string(),
  watchProgress: z.number().min(0).max(100).optional(),
  isCompleted: z.boolean().optional(),
  timeSpent: z.number().min(0).optional(),
});

interface Params {
  params: {
    id: string;
  };
}

// PATCH /api/enrollments/[id]/progress - Update lesson progress
export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const enrollmentId = params.id;
    const body = await req.json();
    
    // Validate request body
    const validation = progressUpdateSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid request data", details: validation.error.errors },
        { status: 400 }
      );
    }

    const { lessonId, watchProgress, isCompleted, timeSpent } = validation.data;

    // Use database connection wrapper for reliable operation
    const result = await withDatabaseConnection(async () => {
      // Verify enrollment belongs to the user
      const enrollment = await prisma.enrollment.findFirst({
        where: {
          id: enrollmentId,
          userId: userId,
        },
        include: {
          course: {
            include: {
              lessons: {
                orderBy: { order: 'asc' },
              },
            },
          },
        },
      });

      if (!enrollment) {
        throw new Error("Enrollment not found");
      }

      // Verify lesson belongs to the course
      const lesson = enrollment.course.lessons.find(l => l.id === lessonId);
      if (!lesson) {
        throw new Error("Lesson not found in this course");
      }

      // Update or create lesson progress
      const lessonProgress = await prisma.lessonProgress.upsert({
        where: {
          enrollmentId_lessonId: {
            enrollmentId: enrollmentId,
            lessonId: lessonId,
          },
        },
        update: {
          ...(watchProgress !== undefined && { watchProgress }),
          ...(isCompleted !== undefined && { isCompleted }),
          ...(timeSpent !== undefined && { timeSpent: { increment: timeSpent } }),
          lastWatched: new Date(),
        },
        create: {
          enrollmentId: enrollmentId,
          lessonId: lessonId,
          watchProgress: watchProgress || 0,
          isCompleted: isCompleted || false,
          timeSpent: timeSpent || 0,
          lastWatched: new Date(),
        },
      });

      // Calculate overall course progress
      const allLessons = enrollment.course.lessons;
      const completedLessons = await prisma.lessonProgress.count({
        where: {
          enrollmentId: enrollmentId,
          isCompleted: true,
        },
      });

      const overallProgress = Math.round((completedLessons / allLessons.length) * 100);

      // Update enrollment progress
      let updateData: any = {
        progress: overallProgress,
      };

      // If lesson is completed, update current lesson to next incomplete lesson
      if (isCompleted) {
        const nextIncompleteLesson = await findNextIncompleteLesson(enrollmentId, allLessons);
        updateData.currentLesson = nextIncompleteLesson?.id || lesson.id;

        // Mark course as completed if all lessons are done
        if (overallProgress === 100) {
          updateData.completedAt = new Date();
        }
      }

      const updatedEnrollment = await prisma.enrollment.update({
        where: { id: enrollmentId },
        data: updateData,
      });

      return {
        message: "Progress updated successfully",
        lessonProgress,
        enrollment: updatedEnrollment,
      };
    });

    if (!result) {
      return NextResponse.json(
        { error: "Database temporarily unavailable" },
        { status: 503 }
      );
    }

    return NextResponse.json(result);

  } catch (error) {
    console.error("Error updating progress:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

async function findNextIncompleteLesson(enrollmentId: string, lessons: any[]) {
  const progressRecords = await prisma.lessonProgress.findMany({
    where: {
      enrollmentId: enrollmentId,
      isCompleted: true,
    },
    select: { lessonId: true },
  });

  const completedLessonIds = new Set(progressRecords.map(p => p.lessonId));
  
  return lessons.find(lesson => !completedLessonIds.has(lesson.id));
}