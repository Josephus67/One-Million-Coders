import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

// Mark route as dynamic
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

interface RouteParams {
  params: {
    userId: string;
    courseId: string;
  };
}

/**
 * GET /api/certificates/[userId]/[courseId]
 * Get certificate data for a user and course
 */
export async function GET(
  req: NextRequest,
  { params }: RouteParams
) {
  try {
    const { userId: authUserId } = await auth();

    if (!authUserId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { userId, courseId } = params;

    // Users can only access their own certificates
    if (authUserId !== userId) {
      return NextResponse.json(
        { error: "Forbidden. You can only access your own certificates" },
        { status: 403 }
      );
    }

    // Get certificate
    const certificate = await prisma.certificate.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
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
      return NextResponse.json(
        { error: "Certificate not found. You may need to pass the exam first." },
        { status: 404 }
      );
    }

    // Get exam result for additional details
    const examResult = await prisma.examResult.findFirst({
      where: {
        userId,
        courseId,
        passed: true,
      },
      orderBy: {
        score: "desc",
      },
    });

    return NextResponse.json({
      certificate: {
        id: certificate.id,
        title: certificate.title,
        description: certificate.description,
        examScore: certificate.examScore,
        issuedAt: certificate.issuedAt,
        certificateUrl: certificate.certificateUrl,
        user: certificate.user,
        course: certificate.course,
      },
      examResult: examResult ? {
        score: examResult.score,
        totalQuestions: examResult.totalQuestions,
        correctAnswers: examResult.correctAnswers,
        createdAt: examResult.createdAt,
      } : null,
    });

  } catch (error: any) {
    console.error("Error fetching certificate:", error);
    return NextResponse.json(
      { 
        error: "Failed to fetch certificate", 
        details: error.message 
      },
      { status: 500 }
    );
  }
}
