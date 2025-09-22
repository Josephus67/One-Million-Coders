import { notFound } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
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
  try {
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
      return null;
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
      return null;
    }

    return {
      lesson,
      course: lesson.course,
      enrollment,
    };
  } catch (error) {
    console.error('Error fetching lesson data:', error);
    return null;
  }
}

export default async function LearningPage({ params }: PageProps) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    notFound();
  }

  const data = await getLessonData(params.id, session.user.id);

  if (!data) {
    notFound();
  }

  // Serialize data for client components
  const serializedData = serializeForClient(data);

  return (
    <LearningPageClient 
      lesson={serializedData.lesson}
      course={serializedData.course}
      enrollment={serializedData.enrollment}
      userId={session.user.id}
    />
  );
}