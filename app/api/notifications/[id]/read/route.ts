import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface Params {
  params: {
    id: string;
  };
}

// PATCH /api/notifications/[id]/read - Mark a specific notification as read
export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const notificationId = params.id;

    // Verify notification belongs to the user and update
    const updatedNotification = await prisma.notification.updateMany({
      where: {
        id: notificationId,
        userId: session.user.id,
      },
      data: {
        isRead: true,
      },
    });

    if (updatedNotification.count === 0) {
      return NextResponse.json(
        { error: "Notification not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      message: "Notification marked as read" 
    });

  } catch (error) {
    console.error("Error marking notification as read:", error);
    return NextResponse.json(
      { error: "Failed to mark notification as read" },
      { status: 500 }
    );
  }
}