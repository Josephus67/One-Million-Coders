import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { writeFile } from "fs/promises";
import { join } from "path";
import { existsSync, mkdirSync } from "fs";
import crypto from "crypto";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("image") as File;
    const type = formData.get("type") as string; // 'avatar' or 'banner'

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!["avatar", "banner"].includes(type)) {
      return NextResponse.json({ error: "Invalid image type" }, { status: 400 });
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File size too large. Maximum 5MB allowed." },
        { status: 400 }
      );
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only JPEG, PNG, and WebP are allowed." },
        { status: 400 }
      );
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), "public", "uploads", "users");
    if (!existsSync(uploadsDir)) {
      mkdirSync(uploadsDir, { recursive: true });
    }

    // Generate unique filename
    const extension = file.name.split(".").pop();
    const uniqueId = crypto.randomBytes(16).toString("hex");
    const filename = `${userId}-${type}-${uniqueId}.${extension}`;
    const filePath = join(uploadsDir, filename);
    const publicUrl = `/uploads/users/${filename}`;

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // Update user's image in database
    const updateData = type === "avatar" 
      ? { image: publicUrl }
      : { profileBanner: publicUrl };

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        image: true,
        profileBanner: true,
      },
    });

    return NextResponse.json({
      message: `${type === "avatar" ? "Profile picture" : "Profile banner"} updated successfully`,
      url: publicUrl,
      user: updatedUser,
    });
  } catch (error) {
    console.error("Image upload error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type"); // 'avatar' or 'banner'

    if (!["avatar", "banner"].includes(type || "")) {
      return NextResponse.json({ error: "Invalid image type" }, { status: 400 });
    }

    // Update user's image in database to null
    const updateData = type === "avatar" 
      ? { image: null }
      : { profileBanner: null };

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        image: true,
        profileBanner: true,
      },
    });

    return NextResponse.json({
      message: `${type === "avatar" ? "Profile picture" : "Profile banner"} removed successfully`,
      user: updatedUser,
    });
  } catch (error) {
    console.error("Image removal error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}