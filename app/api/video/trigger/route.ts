import { NextResponse } from "next/server";
import { inngest } from "@/lib/inngest/client";
import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { projectId } = await request.json();

    if (!projectId) {
      return NextResponse.json({ error: "Project ID is required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId: user.id,
      },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    if (project.status === "completed") {
      return NextResponse.json({ 
        message: "Project already completed",
        status: project.processingStatus,
        currentStep: project.currentStep,
      });
    }

    await inngest.send({
      name: "video/generation.start",
      data: {
        projectId,
        userId: user.id,
      },
    });

    await prisma.project.update({
      where: { id: projectId },
      data: {
        processingStatus: "generating_prompt",
        currentStep: 1,
      },
    });

    return NextResponse.json({
      message: "Video generation started",
      projectId,
    });
  } catch (error) {
    console.error("Error triggering video generation:", error);
    return NextResponse.json(
      { error: "Failed to trigger video generation" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("projectId");

    if (!projectId) {
      return NextResponse.json({ error: "Project ID is required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId: user.id,
      },
      select: {
        processingStatus: true,
        currentStep: true,
        generatedPrompt: true,
        themeConfig: true,
        remotionCode: true,
        status: true,
      },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error("Error getting project status:", error);
    return NextResponse.json(
      { error: "Failed to get project status" },
      { status: 500 }
    );
  }
}
