export { prisma } from "@/lib/db";

export const steps = {
  idle: "idle",
  generatingPrompt: "generating_prompt",
  generatingThemeConfig: "generating_theme_config",
  generatingRemotionCode: "generating_remotion_code",
  renderingVideo: "rendering_video",
  completed: "completed",
  failed: "failed",
} as const;

export type ProcessingStatus = (typeof steps)[keyof typeof steps];

export async function updateProjectStatus(
  projectId: string,
  status: ProcessingStatus,
  currentStep: number,
  additionalFields?: {
    generatedPrompt?: string;
    themeConfig?: import("@prisma/client").Prisma.InputJsonValue;
    remotionCode?: string;
  }
) {
  const { prisma } = await import("@/lib/db");
  return prisma.project.update({
    where: { id: projectId },
    data: {
      processingStatus: status,
      currentStep,
      ...(additionalFields?.generatedPrompt && { generatedPrompt: additionalFields.generatedPrompt }),
      ...(additionalFields?.themeConfig && { themeConfig: additionalFields.themeConfig }),
      ...(additionalFields?.remotionCode && { remotionCode: additionalFields.remotionCode }),
    },
  });
}

export async function getProjectWithUser(projectId: string) {
  const { prisma } = await import("@/lib/db");
  return prisma.project.findUnique({
    where: { id: projectId },
    include: { user: true },
  });
}
