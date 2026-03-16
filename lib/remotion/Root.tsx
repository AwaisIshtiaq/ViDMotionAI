import { Composition } from "remotion";
import { GeneratedVideo } from "./GeneratedVideo";

export const RemotionRoot = () => {
  return (
    <Composition
      id="GeneratedVideo"
      component={GeneratedVideo}
      durationInFrames={450}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={{
        title: "AI Generated Video",
        subtitle: "Powered by Remotion",
        themeConfig: {
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
        },
      }}
    />
  );
};
