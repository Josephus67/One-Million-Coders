import { notFound, redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import ExamPageClient from './exam-client';

// Force dynamic rendering for production
export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface PageProps {
  params: {
    slug: string;
  };
}

export default async function ExamPage({ params }: PageProps) {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  const { slug } = params;

  // Get course details
  const course = await prisma.course.findUnique({
    where: { slug: slug },
    include: {
      instructor: {
        select: {
          name: true,
          image: true,
        },
      },
      category: {
        select: {
          name: true,
        },
      },
      lessons: {
        where: { isPublished: true },
        orderBy: { order: 'asc' },
      },
    },
  });

  if (!course) {
    notFound();
  }

  // Check enrollment
  const enrollment = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId,
        courseId: course.id,
      },
    },
    include: {
      lessonProgress: true,
    },
  });

  if (!enrollment) {
    redirect(`/courses/${course.slug}`);
  }

  // Check if all lessons are completed
  const totalLessons = course.lessons.length;
  const completedLessons = enrollment.lessonProgress.filter(
    (lp) => lp.isCompleted
  ).length;

  const allLessonsCompleted = completedLessons === totalLessons && totalLessons > 0;

  // Get previous exam results
  const previousResults = await prisma.examResult.findMany({
    where: {
      userId,
      courseId: course.id,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  // Check if certificate already exists (user has passed)
  const certificate = await prisma.certificate.findUnique({
    where: {
      userId_courseId: {
        userId,
        courseId: course.id,
      },
    },
  });

  return (
    <ExamPageClient
      course={JSON.parse(JSON.stringify(course))}
      allLessonsCompleted={allLessonsCompleted}
      completedLessons={completedLessons}
      totalLessons={totalLessons}
      previousResults={JSON.parse(JSON.stringify(previousResults))}
      hasCertificate={!!certificate}
    />
  );
}
