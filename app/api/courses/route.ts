import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// GET /api/courses - Get all courses with optional filtering
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const level = searchParams.get("level");
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");

    const skip = (page - 1) * limit;

    const where: any = {
      status: "PUBLISHED",
    };

    if (category) {
      where.category = {
        slug: category,
      };
    }

    if (level) {
      where.level = level.toUpperCase();
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    const [courses, total] = await Promise.all([
      prisma.course.findMany({
        where,
        include: {
          instructor: {
            select: { id: true, name: true, image: true },
          },
          category: {
            select: { id: true, name: true, slug: true },
          },
          _count: {
            select: {
              enrollments: true,
              lessons: true,
              reviews: true,
            },
          },
          reviews: {
            select: { rating: true },
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.course.count({ where }),
    ]);

    // Calculate average rating for each course
    const coursesWithRating = courses.map((course) => {
      const avgRating = course.reviews.length > 0
        ? course.reviews.reduce((sum, review) => sum + review.rating, 0) / course.reviews.length
        : 0;

      return {
        ...course,
        averageRating: Math.round(avgRating * 10) / 10,
        totalStudents: course._count.enrollments,
        totalLessons: course._count.lessons,
        totalReviews: course._count.reviews,
      };
    });

    return NextResponse.json({
      courses: coursesWithRating,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });

  } catch (error) {
    console.error("Error fetching courses:", error);
    return NextResponse.json(
      { error: "Failed to fetch courses" },
      { status: 500 }
    );
  }
}

// POST /api/courses - Create a new course (instructors only)
const createCourseSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  categoryId: z.string().min(1, "Category is required"),
  level: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]),
  price: z.number().min(0, "Price must be non-negative"),
  duration: z.string().optional(),
  image: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Check if user is instructor or admin
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (!user || (user.role !== "INSTRUCTOR" && user.role !== "ADMIN")) {
      return NextResponse.json(
        { error: "Only instructors can create courses" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const data = createCourseSchema.parse(body);

    // Generate slug from title
    const slug = data.title
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");

    // Check if slug already exists
    const existingCourse = await prisma.course.findUnique({
      where: { slug },
    });

    if (existingCourse) {
      return NextResponse.json(
        { error: "Course with this title already exists" },
        { status: 400 }
      );
    }

    const course = await prisma.course.create({
      data: {
        ...data,
        slug,
        instructorId: session.user.id,
        status: "DRAFT",
      },
      include: {
        instructor: {
          select: { id: true, name: true, image: true },
        },
        category: {
          select: { id: true, name: true, slug: true },
        },
      },
    });

    return NextResponse.json(course, { status: 201 });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error creating course:", error);
    return NextResponse.json(
      { error: "Failed to create course" },
      { status: 500 }
    );
  }
}