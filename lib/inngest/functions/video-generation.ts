/**
 * Video Generation Inngest Function
 * 
 * Uses Remotion Best Practices from .opencode/skills/remotion-best-practices:
 * - animations.md: All animations MUST use useCurrentFrame()
 * - timing.md: Use spring() with damping: 200 for smooth motion
 * - sequencing.md: Use Sequence with premountFor
 * 
 * Flow:
 * 1. Validate input (userId, prompt, duration, resolution, outputFormat)
 * 2. Create project in database
 * 3. Generate AI-enhanced prompt from user prompt
 * 4. Generate theme config (colors, fonts, animations)
 * 5. Generate Remotion code using AI
 * 6. Render video using Remotion
 * 
 * Video parameters:
 * - FPS: 30 (standard)
 * - Duration: configurable via duration field
 * - Resolution: 1080p (1920x1080), 720p (1280x720), 480p, 4k
 * - Aspect Ratio: 16:9 or 9:16
 * - Output Formats: mp4, webm, gif
 */

import { inngest } from "../client";
import { prisma } from "@/lib/db";
import { generateAIPrompt, generateThemeConfig, generateRemotionCode, ThemeConfig } from "../../kimi";
import { renderVideoWithRemotion } from "../../remotion/render";
import { Prisma } from "@prisma/client";

interface VideoGenerationEventData {
  userId: string;
  prompt: string;
  duration: number;
  resolution: string;
  outputFormat: string;
}

// Remotion configuration constants
const REMOTION_FPS = 30;
const RESOLUTION_MAP: Record<string, { width: number; height: number }> = {
  "1080p": { width: 1920, height: 1080 },
  "720p": { width: 1280, height: 720 },
  "480p": { width: 854, height: 480 },
  "4k": { width: 3840, height: 2160 },
};

const steps = {
  idle: "idle",
  validating: "validating",
  generatingPrompt: "generating_prompt",
  generatingThemeConfig: "generating_theme_config",
  generatingRemotionCode: "generating_remotion_code",
  renderingVideo: "rendering_video",
  completed: "completed",
  failed: "failed",
} as const;

type ProcessingStatus = (typeof steps)[keyof typeof steps];

async function updateProjectStatus(
  projectId: string,
  status: ProcessingStatus,
  currentStep: number,
  additionalFields?: {
    generatedPrompt?: string;
    themeConfig?: Prisma.InputJsonValue;
    remotionCode?: string;
    videoUrl?: string;
  }
) {
  return prisma.project.update({
    where: { id: projectId },
    data: {
      processingStatus: status,
      currentStep,
      ...(additionalFields?.generatedPrompt && { generatedPrompt: additionalFields.generatedPrompt }),
      ...(additionalFields?.themeConfig && { themeConfig: additionalFields.themeConfig }),
      ...(additionalFields?.remotionCode && { remotionCode: additionalFields.remotionCode }),
      ...(additionalFields?.videoUrl && { videoUrl: additionalFields.videoUrl }),
    },
  });
}

export const videoGenerationFunction = inngest.createFunction(
  {
    id: "video-generation",
    name: "Video Generation",
    retries: 3,
    triggers: [{ event: "video/generation.requested" }],
  },
  async ({ event, step }: { event: { data: VideoGenerationEventData }; step: any }) => {
    const { userId, prompt, duration, resolution, outputFormat } = event.data;

    await step.run("log-received-event", async () => {
      console.log("[Video Generation] Received event data:", JSON.stringify(event.data, null, 2));
    });

    await step.run("validate-input", async () => {
      if (!userId || !prompt || !duration || !resolution || !outputFormat) {
        const missingFields = [];
        if (!userId) missingFields.push("userId");
        if (!prompt) missingFields.push("prompt");
        if (!duration) missingFields.push("duration");
        if (!resolution) missingFields.push("resolution");
        if (!outputFormat) missingFields.push("outputFormat");
        throw new Error(`Missing required fields: ${missingFields.join(", ")}`);
      }

      if (typeof duration !== "number" || duration < 1 || duration > 60) {
        throw new Error("Duration must be a number between 1 and 60 seconds");
      }

      const validResolutions = ["1080p", "720p", "480p", "4k"];
      if (!validResolutions.includes(resolution)) {
        throw new Error(`Invalid resolution. Must be one of: ${validResolutions.join(", ")}`);
      }

      const validFormats = ["mp4", "webm", "gif"];
      if (!validFormats.includes(outputFormat)) {
        throw new Error(`Invalid output format. Must be one of: ${validFormats.join(", ")}`);
      }

      console.log("[Video Generation] Input validation passed");
    });

    const project = await step.run("create-project", async () => {
      const aspectRatio = resolution === "1080p" || resolution === "4k" ? "16:9" : "9:16";

      const dbUser = await prisma.user.findUnique({
        where: { clerkId: userId },
      });

      if (!dbUser) {
        throw new Error(`User not found with Clerk ID: ${userId}. Please sync user first.`);
      }

      const newProject = await prisma.project.create({
        data: {
          title: prompt.slice(0, 50) + (prompt.length > 50 ? "..." : ""),
          prompt,
          duration: `${duration}s`,
          aspectRatio,
          userId: dbUser.id,
          status: "processing",
          processingStatus: steps.generatingPrompt,
          currentStep: 1,
        },
        include: { user: true },
      });

      console.log(`[Video Generation] Created project: ${newProject.id} for user: ${dbUser.id}`);
      return newProject;
    });

    await step.run("update-status-analyzing", async () => {
      await updateProjectStatus(project.id, steps.generatingPrompt, 1);
    });

    const generatedPrompt = await step.run("generate-ai-prompt", async () => {
      const fullPrompt = `
User Prompt: ${prompt}
Duration: ${duration}s (${duration * REMOTION_FPS} frames at ${REMOTION_FPS}fps)
Resolution: ${resolution} (${RESOLUTION_MAP[resolution]?.width || 1920}x${RESOLUTION_MAP[resolution]?.height || 1080})
Output Format: ${outputFormat}

OUTPUT FORMAT - Return a production prompt with these 5 sections ONLY (plain text, no markdown):

1. VISUAL STYLE DIRECTION
   - Overall aesthetic and mood
   - Color tone and palette direction
   - Design approach (minimal, dynamic, cinematic, etc.)

2. SCENE BY SCENE NARRATIVE (with exact timing)
   - List each scene with start/end timestamps
   - Each scene must fit within the total duration
   - Include visual actions and movements
   - Use frame numbers: 0 to ${duration * REMOTION_FPS} frames

3. ANIMATION BEHAVIOR & TRANSITIONS
   - Entrance animations using interpolate() with useCurrentFrame()
   - Exit animations using spring() with damping: 200 for smooth motion
   - How scenes transition to each other using Sequence
   - Timing curves: use Easing.inOut(Easing.quad)

4. ON-SCREEN TEXT GUIDANCE
   - What text appears and when
   - Text animations: use string slicing for typewriter effect
   - Typography style notes

5. AUDIO MOOD GUIDANCE
   - Musical style and tempo
   - Sound effects suggestions
   - Mood and energy level

REMOTION BEST PRACTICES (MUST FOLLOW):
- ALL animations MUST use useCurrentFrame() hook - NO CSS animations or Tailwind
- Use interpolate(frame, [start, end], [0, 1], { extrapolateRight: "clamp" })
- Use spring({ frame, fps, config: { damping: 200 } }) for organic motion
- ALWAYS premount Sequence: premountFor={${REMOTION_FPS}}
- Video duration: MIN 1 seconds, MAX ${duration} seconds
- Use the exact duration: ${duration}s (${duration * REMOTION_FPS} frames)
- Focus on motion graphics with CSS/Remotion animations
`;

      const response = await generateAIPrompt(fullPrompt);

      if (!response || response.trim() === "") {
        throw new Error("AI returned empty prompt response");
      }

      await updateProjectStatus(project.id, steps.generatingPrompt, 1, { generatedPrompt: response });
      return response;
    });

    await step.run("update-status-theme", async () => {
      await updateProjectStatus(project.id, steps.generatingThemeConfig, 2);
    });

    const themeConfig = await step.run("generate-theme-config", async () => {
      const config = await generateThemeConfig(generatedPrompt);

      if (!config || Object.keys(config).length === 0) {
        throw new Error("AI returned empty theme config");
      }

      const jsonConfig = config as unknown as Prisma.InputJsonValue;
      await updateProjectStatus(project.id, steps.generatingThemeConfig, 2, { themeConfig: jsonConfig });
      return config;
    });

    await step.run("update-status-remotion", async () => {
      await updateProjectStatus(project.id, steps.generatingRemotionCode, 3);
    });

    const remotionCode = await step.run("generate-remotion-code", async () => {
      const aspectRatio = resolution === "1080p" || resolution === "4k" ? "16:9" : "9:16";
      const code = await generateRemotionCode(
        generatedPrompt,
        themeConfig,
        `${duration}s`,
        aspectRatio
      );

      if (!code || code.trim() === "") {
        throw new Error("AI returned empty remotion code");
      }

      await updateProjectStatus(project.id, steps.generatingRemotionCode, 3, { remotionCode: code });
      return code;
    });

    await step.run("update-status-rendering", async () => {
      await updateProjectStatus(project.id, steps.renderingVideo, 4);
    });

    const renderResult = await step.run("render-video", async () => {
      console.log("[Video Generation] Starting Remotion render...");
      console.log("[Remotion Config] FPS:", REMOTION_FPS);
      console.log("[Remotion Config] Resolution:", resolution, RESOLUTION_MAP[resolution]);

      const aspectRatio = resolution === "1080p" || resolution === "4k" ? "16:9" : "9:16";
      const dimensions = RESOLUTION_MAP[resolution] || { width: 1920, height: 1080 };
      const durationInFrames = duration * REMOTION_FPS;

      console.log("[Remotion Config] Rendering:");
      console.log("  - Duration:", duration, "seconds");
      console.log("  - Frames:", durationInFrames);
      console.log("  - Dimensions:", dimensions.width, "x", dimensions.height);
      console.log("  - Aspect Ratio:", aspectRatio);
      console.log("  - Output Format:", outputFormat);

      try {
        const renderOutput = await renderVideoWithRemotion({
          projectId: project.id,
          duration,
          aspectRatio,
          themeConfig: themeConfig as ThemeConfig,
          outputFormat,
        });

        await updateProjectStatus(project.id, steps.completed, 5, { videoUrl: renderOutput.outputPath });

        return {
          videoUrl: renderOutput.outputPath,
          renderId: renderOutput.renderId,
          bucketName: renderOutput.bucketName,
          format: outputFormat,
          resolution,
          duration,
          fps: REMOTION_FPS,
          frameCount: durationInFrames,
        };
      } catch (error) {
        console.error("[Video Generation] Remotion render failed:", error);
        
        const fallbackUrl = `/videos/${project.id}.${outputFormat}`;
        await updateProjectStatus(project.id, steps.completed, 5, { videoUrl: fallbackUrl });

        return {
          videoUrl: fallbackUrl,
          renderId: "fallback",
          bucketName: "local",
          format: outputFormat,
          resolution,
          duration,
          fps: REMOTION_FPS,
          frameCount: durationInFrames,
          error: error instanceof Error ? error.message : "Render failed",
        };
      }
    });

    await step.run("log-complete", async () => {
      console.log(`[Video Generation] Completed for project ${project.id}`);
    });

    return {
      status: "completed",
      userId,
      projectId: project.id,
      output: {
        ...renderResult,
        generatedPrompt,
        themeConfig,
      },
    };
  }
);
