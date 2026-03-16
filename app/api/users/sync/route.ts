import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";

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
      { error: "Unauthorized", isNewUser: false },
      { status: 401 }
    );
  }

  try {
    const { email, fullName } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Missing required fields", isNewUser: false },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { clerkId },
    });

    if (existingUser) {
      await prisma.user.update({
        where: { clerkId },
        data: {
          email,
          name: fullName,
        },
      });

      return NextResponse.json({
        success: true,
        isNewUser: false,
        user: existingUser,
      });
    }

    const newUser = await prisma.user.create({
      data: {
        clerkId,
        email,
        name: fullName,
        credits: 100,
      },
    });

    return NextResponse.json({
      success: true,
      isNewUser: true,
      user: newUser,
    });
  } catch (error) {
    console.error("Error syncing user:", error);
    return NextResponse.json(
      { error: "Failed to sync user", isNewUser: false },
      { status: 500 }
    );
  }
}
