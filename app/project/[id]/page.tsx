import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import ProjectWorkspace from "@/components/project/ProjectWorkspace";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { userId } = await auth();
  const { id } = await params;

  if (!userId) {
    return notFound();
  }

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  if (!user) {
    return notFound();
  }

  const project = await prisma.project.findFirst({
    where: {
      id,
      userId: user.id,
    },
  });

  if (!project) {
    return notFound();
  }

  return <ProjectWorkspace />;
}
