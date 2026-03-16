"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { 
  Send, 
  MessageSquare, 
  Palette, 
  ArrowLeft, 
  Share2, 
  Download, 
  Check,
  Sparkles,
  Music,
  Film,
  Monitor,
  Smartphone,
  Square,
  Clock,
  Play,
  Pause,
  RefreshCw
} from "lucide-react";

const COLORS = {
  bg: "#F5F3FF",
  primary: "#7C3AED",
  primaryHover: "#6D28D9",
  primaryLight: "#EDE9FE",
  text: "#1a1a2e",
  textSecondary: "#6b6b80",
  border: "#e5e5ea",
  white: "#FFFFFF",
  success: "#10B981",
};

interface ProjectStatus {
  processingStatus: string;
  currentStep: number;
  generatedPrompt?: string;
  themeConfig?: Record<string, unknown>;
  remotionCode?: string;
  status: string;
}

const stepLabels: Record<string, { title: string; subtitle: string }> = {
  idle: { title: "Waiting to Start", subtitle: "Ready to generate video", },
  generating_prompt: { title: "Analyzing Prompt", subtitle: "Understanding your request", },
  generating_theme_config: { title: "Generating Theme", subtitle: "Creating visual theme", },
  generating_remotion_code: { title: "Writing Code", subtitle: "Generating Remotion composition", },
  rendering_video: { title: "Rendering Video", subtitle: "Processing final output", },
  completed: { title: "Video Ready", subtitle: "Your video is ready", },
  failed: { title: "Generation Failed", subtitle: "Something went wrong", },
};

const aspectRatios = [
  { id: "16:9", label: "16:9", icon: Monitor, desc: "Landscape" },
  { id: "9:16", label: "9:16", icon: Smartphone, desc: "Portrait" },
  { id: "1:1", label: "1:1", icon: Square, desc: "Square" },
];

const durations = ["5s", "10s", "15s", "20s", "30s"];

function getStepProgress(status: string): { steps: Array<{ id: number; title: string; subtitle: string; status: "completed" | "active" | "pending" }>; progress: number } {
  const stepOrder = [
    "idle",
    "generating_prompt",
    "generating_theme_config", 
    "generating_remotion_code",
    "rendering_video",
    "completed",
  ];

  const currentIndex = stepOrder.indexOf(status);
  
  if (status === "completed") {
    return {
      steps: stepOrder.slice(1, -1).map((s, i) => ({
        id: i + 1,
        ...stepLabels[s],
        status: "completed" as const,
      })),
      progress: 100,
    };
  }

  if (status === "failed") {
    return {
      steps: stepOrder.slice(1).map((s, i) => ({
        id: i + 1,
        ...stepLabels[s],
        status: "pending" as const,
      })),
      progress: 0,
    };
  }

  const steps = stepOrder.slice(1, -1).map((s, i) => {
    if (i < currentIndex) {
      return { id: i + 1, ...stepLabels[s], status: "completed" as const };
    } else if (i === currentIndex) {
      return { id: i + 1, ...stepLabels[s], status: "active" as const };
    }
    return { id: i + 1, ...stepLabels[s], status: "pending" as const };
  });

  const progress = currentIndex >= 0 ? Math.round((currentIndex / 4) * 100) : 0;

  return { steps, progress };
}

export default function ProjectWorkspace() {
  const params = useParams();
  const projectId = params?.id as string;
  
  const [activeTab, setActiveTab] = useState("theme");
  const [chatInput, setChatInput] = useState("");
  const [aspectRatio, setAspectRatio] = useState("16:9");
  const [duration, setDuration] = useState("10s");
  const [projectStatus, setProjectStatus] = useState<ProjectStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [messages] = useState<{ role: "user" | "assistant"; content: string }[]>([
    {
      role: "assistant",
      content: `I'm ready to generate your video based on:\n"Show Search bar and add typing a text 'Taskybear: AI ToDo Planner and Habit Tracker App animation.'"\n\nWhat style or details would you like to refine?`,
    },
  ]);

  useEffect(() => {
    if (!projectId) return;

    const fetchStatus = async () => {
      try {
        const response = await fetch(`/api/video/trigger?projectId=${projectId}`);
        if (response.ok) {
          const data = await response.json();
          setProjectStatus(data);
        }
      } catch (error) {
        console.error("Error fetching project status:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();

    const interval = setInterval(fetchStatus, 3000);
    return () => clearInterval(interval);
  }, [projectId]);

  useEffect(() => {
    if (!projectId || !projectStatus) return;

    if (projectStatus.status === "pending" && projectStatus.processingStatus === "idle") {
      triggerVideoGeneration();
    }
  }, [projectStatus, projectId]);

  const triggerVideoGeneration = async () => {
    try {
      const response = await fetch("/api/video/trigger", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId }),
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log("Video generation started:", data);
      }
    } catch (error) {
      console.error("Error triggering video generation:", error);
    }
  };

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    setChatInput("");
  };

  const { steps: progressSteps, progress } = getStepProgress(projectStatus?.processingStatus || "idle");
  const isCompleted = projectStatus?.processingStatus === "completed";
  const isFailed = projectStatus?.processingStatus === "failed";

  return (
    <div className="min-h-screen" style={{ backgroundColor: COLORS.bg }}>
      <header 
        className="fixed top-0 left-0 right-0 z-50 border-b"
        style={{ 
          backgroundColor: COLORS.white, 
          borderColor: COLORS.border 
        }}
      >
        <div className="max-w-[1600px] mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-2">
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryHover} 100%)` }}
              >
                <span className="text-white font-bold text-lg">V</span>
              </div>
              <span className="text-xl font-bold" style={{ color: COLORS.text }}>ViDMotionAI</span>
            </div>

            <div className="w-px h-10" style={{ backgroundColor: COLORS.border }} />

            <button 
              className="p-2.5 rounded-xl hover:bg-gray-100 transition-colors"
              style={{ color: COLORS.textSecondary }}
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 
              className="text-base font-bold truncate max-w-md"
              style={{ color: COLORS.text }}
            >
              Taskybear: AI ToDo Planner and Habit Tracker App animation.
            </h1>
            <span 
              className="text-xs px-4 py-1.5 rounded-full font-semibold"
              style={{ 
                backgroundColor: isCompleted ? "#D1FAE5" : isFailed ? "#FEE2E2" : COLORS.primaryLight, 
                color: isCompleted ? "#059669" : isFailed ? "#DC2626" : COLORS.primary 
              }}
            >
              {isCompleted ? "COMPLETED" : isFailed ? "FAILED" : "PROCESSING"}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              className="gap-2 font-medium"
              style={{ color: COLORS.textSecondary }}
            >
              <Share2 className="w-4 h-4" />
              Share
            </Button>
            <Button
              className="gap-2 font-semibold px-6"
              disabled={!isCompleted}
              style={{ 
                backgroundColor: isCompleted ? COLORS.primary : "#9CA3AF",
                borderRadius: "9999px",
                cursor: isCompleted ? "pointer" : "not-allowed"
              }}
            >
              <Download className="w-4 h-4" />
              Export
            </Button>
          </div>
        </div>
      </header>

      <div className="flex pt-20 h-[calc(100vh-80px)]">
        <aside 
          className="w-[420px] border-r flex flex-col"
          style={{ 
            backgroundColor: COLORS.white, 
            borderColor: COLORS.border 
          }}
        >
          <Tabs 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="flex flex-col h-full"
          >
            <div className="p-4 border-b" style={{ borderColor: COLORS.border }}>
              <TabsList 
                className="w-full"
                style={{ backgroundColor: COLORS.bg }}
              >
                <TabsTrigger 
                  value="chat"
                  className="flex-1 gap-2 font-semibold"
                  style={{ color: COLORS.textSecondary }}
                >
                  <MessageSquare className="w-4 h-4" />
                  Chat
                </TabsTrigger>
                <TabsTrigger 
                  value="theme"
                  className="flex-1 gap-2 font-semibold"
                  style={{ color: COLORS.textSecondary }}
                >
                  <Palette className="w-4 h-4" />
                  Theme
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent 
              value="chat" 
              className="flex flex-col flex-1 m-0"
              style={{ backgroundColor: COLORS.white }}
            >
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                  >
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ring-2 ring-offset-2 ring-purple-200"
                      style={{ 
                        backgroundColor: msg.role === "assistant" ? COLORS.primary : COLORS.bg,
                      }}
                    >
                      {msg.role === "assistant" ? (
                        <Sparkles className="w-4 h-4 text-white" />
                      ) : (
                        <span className="text-xs font-medium" style={{ color: COLORS.textSecondary }}>U</span>
                      )}
                    </div>
                    <div
                      className="p-4 rounded-2xl max-w-[85%]"
                      style={{
                        backgroundColor: msg.role === "assistant" ? COLORS.white : "#F3F4F6",
                        border: msg.role === "assistant" ? `1px solid ${COLORS.border}` : undefined,
                        boxShadow: msg.role === "assistant" ? "0 2px 8px rgba(0,0,0,0.04)" : undefined,
                      }}
                    >
                      <p
                        className="text-sm leading-relaxed whitespace-pre-wrap"
                        style={{ color: COLORS.text }}
                      >
                        {msg.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div 
                className="p-4 border-t"
                style={{ borderColor: COLORS.border, backgroundColor: COLORS.white }}
              >
                <Textarea
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Type your message..."
                  className="min-h-[80px] resize-none rounded-xl"
                  style={{
                    backgroundColor: COLORS.bg,
                    borderColor: COLORS.border,
                    color: COLORS.text,
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
                <Button
                  onClick={handleSendMessage}
                  className="mt-3 w-full font-semibold"
                  style={{
                    backgroundColor: COLORS.primary,
                    borderRadius: "9999px",
                  }}
                >
                  <Send className="w-4 h-4 mr-2" />
                  Send
                </Button>
              </div>
            </TabsContent>

            <TabsContent 
              value="theme" 
              className="flex-1 m-0 p-6 overflow-y-auto"
              style={{ backgroundColor: COLORS.white }}
            >
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-bold mb-1" style={{ color: COLORS.text }}>
                    Theme Settings
                  </h3>
                  <p style={{ color: COLORS.textSecondary }} className="text-sm">
                    Customize your video appearance
                  </p>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-semibold flex items-center gap-2" style={{ color: COLORS.text }}>
                    <Monitor className="w-4 h-4" />
                    Aspect Ratio
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {aspectRatios.map((ratio) => {
                      const Icon = ratio.icon;
                      const isActive = aspectRatio === ratio.id;
                      return (
                        <button
                          key={ratio.id}
                          onClick={() => setAspectRatio(ratio.id)}
                          className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                            isActive ? "" : "hover:border-gray-300"
                          }`}
                          style={{
                            backgroundColor: isActive ? COLORS.primaryLight : COLORS.white,
                            borderColor: isActive ? COLORS.primary : COLORS.border,
                          }}
                        >
                          <Icon 
                            className="w-6 h-6" 
                            style={{ color: isActive ? COLORS.primary : COLORS.textSecondary }} 
                          />
                          <span 
                            className="text-sm font-semibold"
                            style={{ color: isActive ? COLORS.primary : COLORS.text }}
                          >
                            {ratio.label}
                          </span>
                          <span 
                            className="text-xs"
                            style={{ color: COLORS.textSecondary }}
                          >
                            {ratio.desc}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-semibold flex items-center gap-2" style={{ color: COLORS.text }}>
                    <Clock className="w-4 h-4" />
                    Duration
                  </label>
                  <div className="flex gap-2">
                    {durations.map((d) => {
                      const isActive = duration === d;
                      return (
                        <button
                          key={d}
                          onClick={() => setDuration(d)}
                          className={`flex-1 py-3 px-4 rounded-xl border-2 font-semibold transition-all ${
                            isActive ? "" : "hover:border-gray-300"
                          }`}
                          style={{
                            backgroundColor: isActive ? COLORS.primaryLight : COLORS.white,
                            borderColor: isActive ? COLORS.primary : COLORS.border,
                            color: isActive ? COLORS.primary : COLORS.text,
                          }}
                        >
                          {d}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </aside>

        <main className="flex-1 p-4 overflow-hidden">
          <div 
            className="w-full h-full py-5 px-5 rounded-2xl text-center"
            style={{ 
              backgroundColor: COLORS.white, 
              boxShadow: "0 4px 24px rgba(124, 58, 237, 0.1)",
              border: `1px solid ${COLORS.primaryLight}`
            }}
          >
            {!isCompleted && !isFailed && (
              <div className="mb-4">
                <div className="relative w-16 h-16 mx-auto">
                  <div 
                    className="absolute inset-0 rounded-full border-3 border-transparent"
                    style={{ 
                      borderTopColor: COLORS.primary,
                      animation: "spin 1.5s linear infinite"
                    }}
                  />
                  <div 
                    className="absolute inset-1 rounded-full border-3 border-transparent"
                    style={{ 
                      borderBottomColor: COLORS.primaryHover,
                      borderRightColor: COLORS.primaryHover,
                      animation: "spin 1s linear infinite reverse"
                    }}
                  />
                  <div 
                    className="absolute inset-2 rounded-full border-3 border-transparent"
                    style={{ 
                      borderLeftColor: COLORS.primaryLight,
                      animation: "spin 0.8s linear infinite"
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div 
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ 
                        backgroundColor: COLORS.primary,
                        animation: "pulse 1s ease-in-out infinite"
                      }}
                    />
                  </div>
                </div>
                <style jsx>{`
                  @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                  }
                  @keyframes pulse {
                    0%, 100% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.5); opacity: 0.5; }
                  }
                `}</style>
              </div>
            )}

            {isCompleted && (
              <div className="mb-4">
                <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center" style={{ backgroundColor: "#D1FAE5" }}>
                  <Check className="w-10 h-10" style={{ color: "#059669" }} />
                </div>
              </div>
            )}

            {isFailed && (
              <div className="mb-4">
                <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center" style={{ backgroundColor: "#FEE2E2" }}>
                  <RefreshCw className="w-10 h-10" style={{ color: "#DC2626" }} />
                </div>
              </div>
            )}

            <h2 
              className="text-lg font-bold mb-1"
              style={{ color: COLORS.text }}
            >
              {isCompleted 
                ? "Your video is ready!" 
                : isFailed 
                  ? "Generation failed"
                  : "Generating your video..."}
            </h2>

            <p 
              className="text-sm mb-4"
              style={{ color: COLORS.textSecondary }}
            >
              {isCompleted 
                ? "Your AI-generated video is ready for download"
                : isFailed
                  ? "Click retry to start again"
                  : stepLabels[projectStatus?.processingStatus || "idle"]?.subtitle || "Analyzing prompt and generating scenes"}
            </p>

            {!isCompleted && !isFailed && (
              <div className="mb-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-semibold" style={{ color: COLORS.text }}>
                    Step {projectStatus?.currentStep || 1} of 5
                  </span>
                  <span className="text-sm font-bold" style={{ color: COLORS.primary }}>
                    {progress}%
                  </span>
                </div>
                <div 
                  className="h-2 rounded-full overflow-hidden"
                  style={{ backgroundColor: COLORS.bg }}
                >
                  <div 
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${progress}%`,
                      background: `linear-gradient(90deg, ${COLORS.primary} 0%, ${COLORS.primaryHover} 100%)`,
                    }}
                  />
                </div>
              </div>
            )}

            <div 
              className="p-3 rounded-xl"
              style={{ backgroundColor: COLORS.white, border: `1px solid ${COLORS.border}` }}
            >
              <div className="space-y-2">
                {progressSteps.map((step) => (
                  <div 
                    key={step.id}
                    className="flex items-center gap-3"
                  >
                    <div className="flex-shrink-0">
                      {step.status === "completed" ? (
                        <div 
                          className="w-4 h-4 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: COLORS.primary }}
                        >
                          <Check className="w-2.5 h-2.5 text-white" />
                        </div>
                      ) : step.status === "active" ? (
                        <div 
                          className="w-4 h-4 rounded-full border-2 animate-spin"
                          style={{ 
                            borderColor: COLORS.primary,
                            borderTopColor: "transparent"
                          }}
                        />
                      ) : (
                        <div 
                          className="w-4 h-4 rounded-full border-2"
                          style={{ borderColor: "#D1D5DB" }}
                        />
                      )}
                    </div>

                    <div className="text-left flex-1">
                      <p 
                        className="text-xs font-semibold"
                        style={{ 
                          color: step.status === "active" ? COLORS.primary : step.status === "completed" ? COLORS.text : "#6B7280"
                        }}
                      >
                        {step.title}
                      </p>
                      <p 
                        className="text-[10px]"
                        style={{ color: COLORS.textSecondary }}
                      >
                        {step.subtitle}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {isFailed && (
              <Button
                onClick={triggerVideoGeneration}
                className="mt-4 font-semibold"
                style={{
                  backgroundColor: COLORS.primary,
                  borderRadius: "9999px",
                }}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Retry Generation
              </Button>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}