import { ThemeConfig } from "../remotion/GeneratedVideo";

export interface RenderOptions {
  projectId: string;
  duration: number;
  aspectRatio: string;
  themeConfig: ThemeConfig;
  outputFormat?: string;
}

export interface RenderResult {
  renderId: string;
  bucketName: string;
  outputPath: string;
  size: number;
  duration: number;
}

export async function renderVideoWithRemotion(
  options: RenderOptions
): Promise<RenderResult> {
  const {
    projectId,
    duration,
    aspectRatio,
    outputFormat = "mp4",
  } = options;

  const dimensions = {
    "16:9": { width: 1920, height: 1080 },
    "9:16": { width: 1080, height: 1920 },
    "1:1": { width: 1080, height: 1080 },
  };

  const { width, height } = dimensions[aspectRatio as keyof typeof dimensions] || dimensions["16:9"];
  const fps = 30;
  const durationInFrames = duration * fps;

  console.log(`[Remotion] Video rendering configuration:`);
  console.log(`  - Project: ${projectId}`);
  console.log(`  - Duration: ${duration}s (${durationInFrames} frames)`);
  console.log(`  - Resolution: ${width}x${height}`);
  console.log(`  - Aspect Ratio: ${aspectRatio}`);
  console.log(`  - Output Format: ${outputFormat}`);

  const renderId = `render-${projectId}-${Date.now()}`;
  const bucketName = process.env.REMOTION_BUCKET_NAME || "ai-motion-renders";

  return {
    renderId,
    bucketName,
    outputPath: `https://${bucketName}.s3.amazonaws.com/renders/${renderId}/out.mp4`,
    size: 0,
    duration,
  };
}

export async function deployAndRender(
  projectId: string,
  themeConfig: ThemeConfig,
  duration: number,
  aspectRatio: string
): Promise<RenderResult> {
  console.log(`[Remotion] Deploying and rendering video:`);
  console.log(`  - Project: ${projectId}`);
  console.log(`  - Duration: ${duration}s`);
  console.log(`  - Aspect Ratio: ${aspectRatio}`);
  console.log(`  - Theme: ${JSON.stringify(themeConfig)}`);

  return {
    renderId: `preview-${projectId}`,
    bucketName: "preview-bucket",
    outputPath: `/videos/${projectId}.mp4`,
    size: 0,
    duration,
  };
}
