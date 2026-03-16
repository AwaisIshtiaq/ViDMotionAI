import { Inngest } from "inngest";

export const inngest = new Inngest({
  id: "ai-motion-video-generator",
});

export const isInngestConfigured = !!process.env.INNGEST_EVENT_KEY;
export const isLocalDev = !process.env.INNGEST_EVENT_KEY;
