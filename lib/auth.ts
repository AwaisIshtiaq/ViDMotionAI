"use server";

import { prisma } from "@/lib/db";

export async function syncUserToDatabase(userId: string, email: string, fullName: string | null) {
  try {
    const user = await prisma.user.upsert({
      where: { clerkId: userId },
      update: {
        email,
        name: fullName,
      },
      create: {
        clerkId: userId,
        email,
        name: fullName,
        credits: 100,
      },
    });

    return { success: true, user };
  } catch (error) {
    console.error("Error syncing user:", error);
    return { success: false, error: "Failed to sync user" };
  }
}

export async function getUserByClerkId(clerkId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { clerkId },
    });
    return user;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
}