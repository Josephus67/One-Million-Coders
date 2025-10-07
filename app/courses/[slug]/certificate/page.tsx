import { notFound, redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import CertificatePageClient from './certificate-client';

interface PageProps {
  params: {
    slug: string;
  };
}

export default async function CertificatePage({ params }: PageProps) {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  const { slug } = params;

  // Get course first to get courseId
  const course = await prisma.course.findUnique({
    where: { slug: slug },
    select: { id: true },
  });

  if (!course) {
    notFound();
  }

  // Get certificate
  const certificate = await prisma.certificate.findUnique({
    where: {
      userId_courseId: {
        userId,
        courseId: course.id,
      },
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      course: {
        select: {
          id: true,
          title: true,
          description: true,
          level: true,
          instructor: {
            select: {
              name: true,
            },
          },
          category: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });

  if (!certificate) {
    notFound();
  }

  // Get exam result - MUST have passed to view certificate
  const examResult = await prisma.examResult.findFirst({
    where: {
      userId,
      courseId: course.id,
      passed: true,
    },
    orderBy: {
      score: 'desc',
    },
  });

  // Extra validation: Ensure user actually passed the exam
  // This prevents any edge cases where a certificate might exist without a passing exam
  if (!examResult || !examResult.passed) {
    // Certificate exists but no passing exam result - security issue
    // Redirect to course page
    redirect(`/courses/${slug}`);
  }

  return (
    <CertificatePageClient
      certificate={JSON.parse(JSON.stringify(certificate))}
      examResult={JSON.parse(JSON.stringify(examResult))}
    />
  );
}
