import { serve } from "inngest/next";
import { inngest } from "@/lib/inngest/client";
import { videoGenerationFunction } from "@/lib/inngest/functions/video-generation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [videoGenerationFunction],
});
