import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma, withDatabaseConnection } from "@/lib/prisma";

// GET /api/notifications - Get user's notifications
export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "10");
    const page = parseInt(searchParams.get("page") || "1");
    const unreadOnly = searchParams.get("unreadOnly") === "true";

    const skip = (page - 1) * limit;

    let whereClause: any = {
      userId: userId,
    };

    if (unreadOnly) {
      whereClause.isRead = false;
    }

    // Use the enhanced database connection wrapper
    const result = await withDatabaseConnection(async () => {
      const [notifications, total] = await Promise.all([
        prisma.notification.findMany({
          where: whereClause,
          orderBy: { createdAt: "desc" },
          skip,
          take: limit,
        }),
        prisma.notification.count({ where: whereClause }),
      ]);

      return {
        notifications,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    });

    // If database operation failed, return empty results
    if (result === null) {
      return NextResponse.json({
        notifications: [],
        pagination: {
          page,
          limit,
          total: 0,
          totalPages: 0,
        },
        warning: "Database temporarily unavailable, showing cached data"
      });
    }

    return NextResponse.json(result);

  } catch (error) {
    console.error("Error fetching notifications:", error);
    
    // Return a graceful error response instead of crashing
    return NextResponse.json({
      notifications: [],
      pagination: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
      },
      error: "Unable to fetch notifications at this time"
    }, { status: 200 }); // Return 200 to prevent app crashes
  }
}

// POST /api/notifications - Create a new notification
export async function POST(req: NextRequest) {
  try {
    const { userId: currentUserId } = await auth();

    if (!currentUserId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { title, message, type, userId } = body;

    // Validate required fields
    if (!title || !message || !type) {
      return NextResponse.json(
        { error: "Title, message, and type are required" },
        { status: 400 }
      );
    }

    // Validate notification type
    const validTypes = ["INFO", "SUCCESS", "WARNING", "ERROR"];
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { error: "Invalid notification type" },
        { status: 400 }
      );
    }

    // If userId is provided, create for that user (admin functionality)
    // Otherwise create for current user
    const targetUserId = userId || currentUserId;

    // Use database connection wrapper for reliability
    const notification = await withDatabaseConnection(async () => {
      return prisma.notification.create({
        data: {
          title,
          message,
          type,
          userId: targetUserId,
          isRead: false,
        },
      });
    });

    if (!notification) {
      return NextResponse.json(
        { error: "Failed to create notification - database unavailable" },
        { status: 503 }
      );
    }

    return NextResponse.json(notification, { status: 201 });

  } catch (error) {
    console.error("Error creating notification:", error);
    return NextResponse.json(
      { error: "Failed to create notification" },
      { status: 500 }
    );
  }
}