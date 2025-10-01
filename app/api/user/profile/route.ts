import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updateProfileSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
  phone: z.string().max(20, "Phone must be less than 20 characters").optional(),
  website: z.string().url("Website must be a valid URL").optional().or(z.literal("")),
  location: z.string().max(100, "Location must be less than 100 characters").optional(),
  linkedin: z.string().url("LinkedIn must be a valid URL").optional().or(z.literal("")),
  github: z.string().url("GitHub must be a valid URL").optional().or(z.literal("")),
  twitter: z.string().url("Twitter must be a valid URL").optional().or(z.literal("")),
  skills: z.array(z.string().max(50)).max(20, "Maximum 20 skills allowed").optional(),
  interests: z.array(z.string().max(50)).max(20, "Maximum 20 interests allowed").optional(),
  isProfilePublic: z.boolean().optional(),
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "Password must be at least 8 characters")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 
      "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character"),
});

// GET /api/user/profile - Get current user's profile
export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        bio: true,
        phone: true,
        website: true,
        location: true,
        linkedin: true,
        github: true,
        twitter: true,
        skills: true,
        interests: true,
        profileBanner: true,
        isProfilePublic: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // If user doesn't exist in database, create a basic record
    if (!user) {
      try {
        // Get user data from Clerk
        const clerkUser = await fetch(`https://api.clerk.com/v1/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
            "Content-Type": "application/json",
          },
        });

        if (clerkUser.ok) {
          const clerkData = await clerkUser.json();
          user = await prisma.user.create({
            data: {
              id: userId,
              email: clerkData.email_addresses?.[0]?.email_address || "",
              name: `${clerkData.first_name || ""} ${clerkData.last_name || ""}`.trim() || null,
              image: clerkData.image_url,
              role: "STUDENT",
              skills: [],
              interests: [],
            },
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
              bio: true,
              phone: true,
              website: true,
              location: true,
              linkedin: true,
              github: true,
              twitter: true,
              skills: true,
              interests: true,
              profileBanner: true,
              isProfilePublic: true,
              role: true,
              createdAt: true,
              updatedAt: true,
            },
          });
        } else {
          // Fallback: create minimal user record
          user = await prisma.user.create({
            data: {
              id: userId,
              email: "", // Will be updated later
              name: null,
              role: "STUDENT",
              skills: [],
              interests: [],
            },
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
              bio: true,
              phone: true,
              website: true,
              location: true,
              linkedin: true,
              github: true,
              twitter: true,
              skills: true,
              interests: true,
              profileBanner: true,
              isProfilePublic: true,
              role: true,
              createdAt: true,
              updatedAt: true,
            },
          });
        }
      } catch (createError) {
        console.error("Error creating user record:", createError);
        return NextResponse.json(
          { error: "Failed to create user profile" },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Profile fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT /api/user/profile - Update current user's profile
export async function PUT(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = updateProfileSchema.parse(body);

    // Clean up empty strings
    const cleanedData = Object.fromEntries(
      Object.entries(validatedData).map(([key, value]) => [
        key,
        value === "" ? null : value,
      ])
    );

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: cleanedData,
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        bio: true,
        phone: true,
        website: true,
        location: true,
        linkedin: true,
        github: true,
        twitter: true,
        skills: true,
        interests: true,
        profileBanner: true,
        isProfilePublic: true,
        role: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Profile update error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/user/profile/change-password - Change user's password
export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: "Password change not supported with Clerk authentication" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error in password change:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}