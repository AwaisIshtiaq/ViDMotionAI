import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
});

export interface ThemeConfig {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
    textSecondary: string;
  };
  fonts: {
    heading: string;
    body: string;
    accent: string;
  };
  animations: {
    entrance: string;
    exit: string;
    transition: string;
  };
  visualEffects: {
    shadow: string;
    blur: string;
    glow: string;
  };
}

export interface VideoScene {
  id: number;
  description: string;
  duration: number;
  elements: string[];
  animation: string;
}

export async function generateAIPrompt(userPrompt: string): Promise<string> {
  const systemPrompt = `You are a professional video production prompt generator for AI Motion Graphics.

${userPrompt}`;

  const result = await model.generateContent(systemPrompt);
  const response = result.response.text();
  return response;
}

export async function generateThemeConfig(aiPrompt: string): Promise<ThemeConfig> {
  const prompt = `Based on the following AI-generated video prompt, create a JSON theme configuration object for Remotion video generation.

AI Prompt: "${aiPrompt}"

Return a JSON object with this exact structure (no other text, no markdown):
{
  "colors": {
    "primary": "#HEXCODE",
    "secondary": "#HEXCODE",
    "accent": "#HEXCODE",
    "background": "#HEXCODE",
    "text": "#HEXCODE",
    "textSecondary": "#HEXCODE"
  },
  "fonts": {
    "heading": "Font Name",
    "body": "Font Name",
    "accent": "Font Name"
  },
  "animations": {
    "entrance": "animation type",
    "exit": "animation type",
    "transition": "transition type"
  },
  "visualEffects": {
    "shadow": "shadow style",
    "blur": "blur style",
    "glow": "glow style"
  }
}`;

  const result = await model.generateContent(prompt);
  const response = result.response.text();
  
  try {
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]) as ThemeConfig;
    }
    throw new Error("No JSON found in response");
  } catch (error) {
    console.error("Failed to parse theme config:", error);
    return getDefaultThemeConfig();
  }
}

export async function generateRemotionCode(
  aiPrompt: string,
  themeConfig: ThemeConfig,
  duration: string,
  aspectRatio: string
): Promise<string> {
  const aspectDimensions: Record<string, { width: number; height: number }> = {
    "16:9": { width: 1920, height: 1080 },
    "9:16": { width: 1080, height: 1920 },
    "1:1": { width: 1080, height: 1080 },
  };

  const dimensions = aspectDimensions[aspectRatio] || aspectDimensions["16:9"];
  const durationSeconds = parseInt(duration.replace("s", ""), 10);
  const fps = 30;
  const durationInFrames = durationSeconds * fps;

  const prompt = `You are a Remotion expert. Generate a complete Remotion composition code for an AI Motion Graphic video.

Project Details:
- Original Prompt: "${aiPrompt}"
- Duration: ${duration} (${durationInFrames} frames at ${fps}fps)
- Aspect Ratio: ${aspectRatio} (${dimensions.width}x${dimensions.height})
- Theme: ${JSON.stringify(themeConfig)}

CRITICAL REMOTION BEST PRACTICES - MUST FOLLOW:

1. ALL animations MUST use useCurrentFrame() - NO CSS animations or Tailwind animation classes
2. Use interpolate() with proper extrapolation: { extrapolateRight: "clamp", extrapolateLeft: "clamp" }
3. Use spring() for organic motion with damping config: { damping: 200 } for smooth, { damping: 20 } for snappy
4. ALWAYS premount Sequence components: premountFor={1 * fps}
5. Inside Sequence, useCurrentFrame() returns local frame (starting from 0)
6. Use Sequence with layout="none" when items shouldn't be wrapped in absolute fill
7. For transitions, use TransitionSeries with fade/slide/wipe from @remotion/transitions
8. Text animations: use string slicing for typewriter effect, NOT per-character opacity
9. Assets: use staticFile() for local files, direct URLs for remote assets

Generate Remotion code with this structure:

\`\`\`tsx
import { 
  useCurrentFrame, 
  useVideoConfig, 
  interpolate, 
  spring, 
  Sequence, 
  Series,
  AbsoluteFill,
  Easing,
  Img,
  staticFile
} from "remotion";
import { TransitionSeries, linearTiming, slideInFromLeft, slideOutToRight } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";

// Theme Colors
const COLORS = {
  primary: "${themeConfig.colors.primary}",
  secondary: "${themeConfig.colors.secondary}",
  accent: "${themeConfig.colors.accent}",
  background: "${themeConfig.colors.background}",
  text: "${themeConfig.colors.text}",
  textSecondary: "${themeConfig.colors.textSecondary}",
};

// Type declarations for props
type CompositionProps = {
  title?: string;
  subtitle?: string;
};

// Scene Component with proper useCurrentFrame() driven animations
const Scene1: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  // Fade in animation using interpolate with clamp extrapolation
  const opacity = interpolate(frame, [0, 2 * fps], [0, 1], { extrapolateRight: "clamp" });
  
  // Scale animation using spring for organic motion
  const scale = spring({ frame, fps, config: { damping: 200 } });
  
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background, justifyContent: "center", alignItems: "center" }}>
      <div style={{ opacity, transform: \`scale(\${scale})\`, fontFamily: "${themeConfig.fonts.heading}" }}>
        Your content here
      </div>
    </AbsoluteFill>
  );
};

// Main Composition
export const MyComposition: React.FC<CompositionProps> = ({ title = "Title", subtitle = "Subtitle" }) => {
  const { fps, width, height } = useVideoConfig();
  
  return (
    <div style={{ width, height, backgroundColor: COLORS.background }}>
      <Sequence premountFor={1 * fps} from={0} durationInFrames={durationInFrames}>
        <Scene1 />
      </Sequence>
    </div>
  );
};

export default MyComposition;
\`\`\`

Return ONLY valid TypeScript/JSX code wrapped in a code block. Ensure all animations use useCurrentFrame() hook from Remotion.`;

  const result = await model.generateContent(prompt);
  const response = result.response.text();

  const codeMatch = response.match(/```(?:tsx|typescript|jsx|javascript)[\s\S]*?```/);
  if (codeMatch) {
    return codeMatch[0].replace(/```(?:tsx|typescript|jsx|javascript)?\n?/, "").replace(/```$/, "");
  }

  return response;
}

function getDefaultThemeConfig(): ThemeConfig {
  return {
    colors: {
      primary: "#7C3AED",
      secondary: "#6D28D9",
      accent: "#A855F7",
      background: "#F5F3FF",
      text: "#1a1a2e",
      textSecondary: "#6b6b80",
    },
    fonts: {
      heading: "Inter",
      body: "Inter",
      accent: "Inter",
    },
    animations: {
      entrance: "fadeIn",
      exit: "fadeOut",
      transition: "slide",
    },
    visualEffects: {
      shadow: "0 4px 12px rgba(0,0,0,0.1)",
      blur: "blur(4px)",
      glow: "0 0 20px rgba(124, 58, 237, 0.3)",
    },
  };
}