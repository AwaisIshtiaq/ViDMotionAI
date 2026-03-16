import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Sequence,
  AbsoluteFill,
  Easing,
} from "remotion";

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
}

interface GeneratedVideoProps {
  title?: string;
  subtitle?: string;
  themeConfig?: ThemeConfig;
  customContent?: string;
}

const COLORS = {
  primary: "#7C3AED",
  secondary: "#6D28D9",
  accent: "#A855F7",
  background: "#F5F3FF",
  text: "#1a1a2e",
  textSecondary: "#6b6b80",
};

export const GeneratedVideo: React.FC<GeneratedVideoProps> = ({
  title = "AI Generated Video",
  subtitle = "Powered by Remotion",
  themeConfig,
  customContent,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const theme = themeConfig?.colors ? {
    primary: themeConfig.colors.primary || COLORS.primary,
    secondary: themeConfig.colors.secondary || COLORS.secondary,
    accent: themeConfig.colors.accent || COLORS.accent,
    background: themeConfig.colors.background || COLORS.background,
    text: themeConfig.colors.text || COLORS.text,
    textSecondary: themeConfig.colors.textSecondary || COLORS.textSecondary,
  } : COLORS;

  const opacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateRight: "clamp",
  });

  const scale = spring({
    frame,
    fps,
    config: { damping: 200, stiffness: 100 },
  });

  const slideY = interpolate(frame, [0, 60], [100, 0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return (
    <AbsoluteFill style={{ backgroundColor: theme.background }}>
      <Sequence premountFor={30} from={0}>
        <div
          style={{
            width,
            height,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            opacity,
          }}
        >
          <div
            style={{
              fontSize: 80,
              fontFamily: themeConfig?.fonts?.heading || "Inter",
              fontWeight: "bold",
              color: theme.text,
              textAlign: "center",
              transform: `scale(${scale}) translateY(${slideY}px)`,
            }}
          >
            {title}
          </div>

          <div
            style={{
              fontSize: 40,
              fontFamily: themeConfig?.fonts?.body || "Inter",
              color: theme.textSecondary,
              marginTop: 20,
              textAlign: "center",
            }}
          >
            {subtitle}
          </div>

          {customContent && (
            <div
              style={{
                fontSize: 24,
                fontFamily: themeConfig?.fonts?.accent || "Inter",
                color: theme.accent,
                marginTop: 40,
                textAlign: "center",
              }}
            >
              {customContent}
            </div>
          )}
        </div>
      </Sequence>

      <Sequence premountFor={30} from={90}>
        <div
          style={{
            position: "absolute",
            bottom: 50,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: 100,
              height: 5,
              backgroundColor: theme.primary,
              borderRadius: 2,
            }}
          />
        </div>
      </Sequence>
    </AbsoluteFill>
  );
};

export default GeneratedVideo;
