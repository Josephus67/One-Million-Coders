import { notFound } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { prisma, withDatabaseConnection } from '@/lib/prisma';
import LearningPageClient from './learning-page-client';

interface PageProps {
  params: {
    id: string;
  };
}

// Utility function to serialize data for client components
function serializeForClient(data: any) {
  return JSON.parse(JSON.stringify(data, (key, value) => {
    // Convert Decimal objects to numbers
    if (value && typeof value === 'object' && value.constructor && value.constructor.name === 'Decimal') {
      return Number(value);
    }
    return value;
  }));
}

async function getLessonData(lessonId: string, userId: string) {
  // Use database connection wrapper for reliable data fetching
  const result = await withDatabaseConnection(async () => {
    // Get the lesson and its course
    const lesson = await prisma.lesson.findUnique({
      where: {
        id: lessonId,
        isPublished: true,
      },
      include: {
        course: {
          include: {
            instructor: {
              select: {
                id: true,
                name: true,
                image: true,
                bio: true,
              },
            },
            category: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
            lessons: {
              where: {
                isPublished: true,
              },
              orderBy: {
                order: 'asc',
              },
            },
            _count: {
              select: {
                enrollments: true,
                reviews: true,
              },
            },
          },
        },
      },
    });

    if (!lesson) {
      return { type: 'not_found' };
    }

    // Check if user is enrolled in the course
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: userId,
          courseId: lesson.course.id,
        },
      },
      include: {
        lessonProgress: true,
      },
    });

    if (!enrollment) {
      return { type: 'not_enrolled' };
    }

    return {
      type: 'success',
      lesson,
      course: lesson.course,
      enrollment,
    };
  });

  if (result === null) {
    throw new Error('Database connection failed. Please try again later.');
  }

  return result;
}

export default async function LearningPage({ params }: PageProps) {
  const { userId } = await auth();

  if (!userId) {
    notFound();
  }

  const data = await getLessonData(params.id, userId);

  if (data.type === 'not_found' || data.type === 'not_enrolled') {
    notFound();
  }

  if (data.type !== 'success') {
    throw new Error('Failed to load lesson data');
  }

  const { lesson, course, enrollment } = data;

  // Serialize data for client components
  const serializedData = serializeForClient({ lesson, course, enrollment });

  return (
    <LearningPageClient 
      lesson={serializedData.lesson}
      course={serializedData.course}
      enrollment={serializedData.enrollment}
      userId={userId}
    />
  );
}