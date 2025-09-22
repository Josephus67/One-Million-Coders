import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const courseId = params.id;

    const course = await prisma.course.findFirst({
      where: { 
        OR: [
          { id: courseId },
          { slug: courseId }
        ]
      },
      include: {
        instructor: {
          select: { 
            id: true, 
            name: true, 
            image: true, 
            bio: true 
          },
        },
        category: {
          select: { 
            id: true, 
            name: true, 
            slug: true 
          },
        },
        lessons: {
          orderBy: { order: 'asc' },
          select: {
            id: true,
            title: true,
            description: true,
            content: true,
            videoUrl: true,
            duration: true,
            order: true,
          }
        },
        _count: {
          select: {
            enrollments: true,
            lessons: true,
            reviews: true,
          },
        },
        reviews: {
          select: { 
            rating: true,
            comment: true,
            user: {
              select: { 
                name: true,
                image: true 
              }
            },
            createdAt: true,
          },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!course) {
      return NextResponse.json(
        { error: "Course not found" },
        { status: 404 }
      );
    }

    // Calculate average rating
    const avgRating = course.reviews.length > 0
      ? course.reviews.reduce((sum, review) => sum + review.rating, 0) / course.reviews.length
      : 0;

    // Transform lessons to include progress info (would come from user enrollment data in real app)
    const lessonsWithProgress = course.lessons.map(lesson => ({
      ...lesson,
      isCompleted: false,
      watchProgress: 0,
    }));

    const courseWithDetails = {
      ...course,
      averageRating: Math.round(avgRating * 10) / 10,
      totalStudents: course._count.enrollments,
      totalLessons: course._count.lessons,
      totalReviews: course._count.reviews,
      lessons: lessonsWithProgress,
    };

    return NextResponse.json(courseWithDetails);

  } catch (error) {
    console.error("Error fetching course:", error);
    return NextResponse.json(
      { error: "Failed to fetch course details" },
      { status: 500 }
    );
  }
}