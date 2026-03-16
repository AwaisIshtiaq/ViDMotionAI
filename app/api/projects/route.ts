import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { inngest, isInngestConfigured, isLocalDev } from "@/lib/inngest/client";

export async function GET() {
  let clerkId = null;
  
  try {
    const authResult = await auth();
    clerkId = authResult.userId;
  } catch (e) {
    console.error("Auth error:", e);
  }

  if (!clerkId) {
    return NextResponse.json(
      { error: "Unauthorized", success: false, projects: [] },
      { status: 401 }
    );
  }

  try {
    const user = await prisma.user.findUnique({
      where: { clerkId },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found", success: false, projects: [] },
        { status: 404 }
      );
    }

    const projects = await prisma.project.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      projects,
    });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects", success: false, projects: [] },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  let clerkId = null;
  
  try {
    const authResult = await auth();
    clerkId = authResult.userId;
  } catch (e) {
    console.error("Auth error:", e);
  }

  if (!clerkId) {
    return NextResponse.json(
      { error: "Unauthorized", success: false },
      { status: 401 }
    );
  }

  try {
    const { prompt, duration, resolution = "1080p", outputFormat = "mp4" } = await request.json();

    if (!prompt || !duration) {
      return NextResponse.json(
        { error: "Missing required fields", success: false },
        { status: 400 }
      );
    }

    const durationSeconds = parseInt(duration.replace("s", ""), 10) || parseInt(duration, 10);

    const user = await prisma.user.findUnique({
      where: { clerkId },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found", success: false },
        { status: 404 }
      );
    }

    await inngest.send({
      name: "video/generation.requested",
      data: {
        userId: user.clerkId,
        prompt,
        duration: durationSeconds,
        resolution,
        outputFormat,
      },
    }).catch(err => {
      console.warn("Inngest event failed:", err.message);
    });

    return NextResponse.json({
      success: true,
      message: "Video generation started",
    });
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      { error: "Failed to create project", success: false },
      { status: 500 }
    );
  }
}
