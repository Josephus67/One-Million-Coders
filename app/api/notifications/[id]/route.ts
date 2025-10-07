import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma, withDatabaseConnection } from "@/lib/prisma";

// Mark route as dynamic
export const dynamic = 'force-dynamic';

interface Params {
  params: {
    id: string;
  };
}

// DELETE /api/notifications/[id] - Delete a specific notification
export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const notificationId = params.id;

    // Verify notification belongs to the user before deleting
    const notification = await prisma.notification.findFirst({
      where: {
        id: notificationId,
        userId: userId,
      },
    });

    if (!notification) {
      return NextResponse.json(
        { error: "Notification not found" },
        { status: 404 }
      );
    }

    await prisma.notification.delete({
      where: { id: notificationId },
    });

    return NextResponse.json({ 
      message: "Notification deleted successfully" 
    });

  } catch (error) {
    console.error("Error deleting notification:", error);
    return NextResponse.json(
      { error: "Failed to delete notification" },
      { status: 500 }
    );
  }
}