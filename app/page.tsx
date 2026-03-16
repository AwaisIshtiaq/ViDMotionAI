"use client";

import { useState, useRef, useEffect } from "react";
import { useUser, UserButton } from "@clerk/nextjs";
import { SignInButton, Show } from "@clerk/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Send,
  ChevronDown,
  User,
  Play,
  ArrowDown,
} from "lucide-react";
import { AuthModal, UserSyncHandler } from "@/components/auth/AuthModal";

const MAX_CHARS = 2000;

const navLinks = [
  { label: "Home", href: "#" },
  { label: "Pricing", href: "#" },
  { label: "Contact Us", href: "#" },
];

const durations = ["5s", "10s", "15s", "20s"];

interface Project {
  id: string;
  title: string;
  prompt: string;
  duration: string;
  aspectRatio: string;
  status: string;
  createdAt: string;
}

export default function Home() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [duration, setDuration] = useState("15s");
  const [aspectRatio, setAspectRatio] = useState("16:9");
  const [showDurationDropdown, setShowDurationDropdown] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const [isCreating, setIsCreating] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isLoggedIn = isLoaded && !!user;
  const charCount = prompt.length;
  const isOverLimit = charCount > MAX_CHARS;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDurationDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      fetchProjects();
    } else {
      setProjects([]);
    }
  }, [isLoggedIn]);

  const fetchProjects = async () => {
    setIsLoadingProjects(true);
    try {
      const response = await fetch("/api/projects");
      const text = await response.text();
      
      if (!response.ok) {
        console.error("Failed to fetch projects:", text);
        setProjects([]);
        return;
      }
      
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        console.error("Invalid JSON response:", text);
        setProjects([]);
        return;
      }
      
      if (data.success) {
        setProjects(data.projects || []);
      } else {
        setProjects([]);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
      setProjects([]);
    } finally {
      setIsLoadingProjects(false);
    }
  };

  const handleGetStarted = () => {
    setAuthMode("signup");
    setAuthModalOpen(true);
  };

  const handleSend = async () => {
    if (!prompt.trim() || isOverLimit) {
      return;
    }

    setIsCreating(true);

    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: prompt.trim(),
          duration,
        }),
      });

      const text = await response.text();
      
      if (!response.ok) {
        console.error("Failed to create project:", text);
        setIsCreating(false);
        return;
      }
      
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        console.error("Invalid JSON response:", text);
        setIsCreating(false);
        return;
      }

      if (data.success) {
        await fetchProjects();
        router.push(`/project`);
      } else {
        console.error("Failed to create project:", data.error);
      }
    } catch (error) {
      console.error("Error creating project:", error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0EEF6] text-[#1a1a2e]">
      <UserSyncHandler />
      
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-[#e5e5ea]">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#7C3AED] flex items-center justify-center">
              <span className="text-white font-bold text-sm">V</span>
            </div>
            <span className="text-xl font-semibold text-[#1a1a2e]">ViDMotionAI</span>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-[#6b6b80] hover:text-[#1a1a2e] transition-colors duration-200 text-sm font-medium"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Auth Area */}
          <div className="flex items-center gap-4">
            <Show when="signed-in" fallback={
              <SignInButton mode="modal">
                <Button className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white border-0 px-6 rounded-full text-sm font-medium">
                  Get Started
                </Button>
              </SignInButton>
            }>
              <UserButton 
                appearance={{
                  elements: {
                    avatarBox: "w-10 h-10 rounded-full",
                  },
                }}
              />
            </Show>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-28 pb-6 px-6">
        <div className="max-w-3xl mx-auto text-center">
          {/* Heading */}
          <h1 className="text-4xl md:text-5xl font-bold text-[#1a1a2e] mb-4 leading-tight">
            Transform Your Ideas into
            <span className="block text-[#7C3AED]">
              Stunning AI Videos
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg text-[#6b6b80] mb-10 max-w-2xl mx-auto leading-relaxed">
            Craft your idea, choose duration and format, and generate polished motion graphics
            in seconds.
          </p>

          {/* Input Card */}
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl border border-[#e5e5ea] shadow-sm p-5">
              {/* Textarea */}
              <div className="relative">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value.slice(0, MAX_CHARS))}
                  placeholder="Describe your video idea in detail..."
                  rows={4}
                  className="w-full bg-transparent text-[#1a1a2e] placeholder:text-[#b0b0c0] resize-none focus:outline-none text-base leading-relaxed"
                />
                <div className={`absolute bottom-2 right-2 text-xs ${isOverLimit ? "text-red-500" : "text-[#b0b0c0]"}`}>
                  {charCount}/{MAX_CHARS}
                </div>
              </div>

              {/* Divider */}
              <div className="h-px bg-[#e5e5ea] my-3" />

              {/* Controls Row */}
              <div className="flex items-center justify-between gap-3">
                {/* Left: Duration + Aspect Ratio */}
                <div className="flex items-center gap-3">
                  {/* Duration Dropdown */}
                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setShowDurationDropdown(!showDurationDropdown)}
                      className="flex items-center gap-2 px-4 py-2.5 bg-[#F0EEF6] border border-[#e5e5ea] rounded-full text-sm font-medium text-[#1a1a2e] hover:border-[#c5c5d0] transition-colors"
                    >
                      <span>{duration}</span>
                      <ChevronDown className="w-3.5 h-3.5 text-[#6b6b80]" />
                    </button>

                    {showDurationDropdown && (
                      <div className="absolute top-full left-0 mt-2 bg-white border border-[#e5e5ea] rounded-xl overflow-hidden z-10 shadow-lg min-w-[100px]">
                        {durations.map((d) => (
                          <button
                            key={d}
                            onClick={() => {
                              setDuration(d);
                              setShowDurationDropdown(false);
                            }}
                            className={`w-full px-4 py-2.5 text-left text-sm transition-colors ${
                              duration === d
                                ? "bg-[#7C3AED] text-white"
                                : "text-[#1a1a2e] hover:bg-[#F0EEF6]"
                            }`}
                          >
                            {d}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Aspect Ratio Toggle */}
                  <div className="flex items-center bg-[#F0EEF6] border border-[#e5e5ea] rounded-full p-0.5">
                    <button
                      onClick={() => setAspectRatio("16:9")}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        aspectRatio === "16:9"
                          ? "bg-white text-[#1a1a2e] shadow-sm"
                          : "text-[#6b6b80] hover:text-[#1a1a2e]"
                      }`}
                    >
                      16:9
                    </button>
                    <button
                      onClick={() => setAspectRatio("9:16")}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        aspectRatio === "9:16"
                          ? "bg-white text-[#1a1a2e] shadow-sm"
                          : "text-[#6b6b80] hover:text-[#1a1a2e]"
                      }`}
                    >
                      9:16
                    </button>
                  </div>
                </div>

                {/* Right: Generate Button */}
                <Button
                  onClick={handleSend}
                  disabled={!prompt.trim() || isOverLimit || isCreating}
                  className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white border-0 rounded-full px-6 py-2.5 text-sm font-medium flex items-center gap-2 transition-all hover:shadow-lg hover:shadow-[#7C3AED]/25 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCreating ? "Creating..." : "Generate"}
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="flex flex-col items-center mt-8 gap-2">
            <div className="flex items-center gap-1.5 text-[#6b6b80] text-sm border border-[#e5e5ea] rounded-full px-3 py-1.5 bg-white/60">
              <span>Scroll</span>
              <ArrowDown className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Trust Badges */}
          <div className="flex items-center justify-center gap-8 mt-6 text-sm text-[#6b6b80]">
            <span>Trusted by 10k+ creators</span>
            <span>Fast render pipeline</span>
            <span>Studio-grade output</span>
          </div>
        </div>
      </section>

      {/* Other Users Created Projects Section */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-[#1a1a2e]">
              {isLoggedIn ? "Your Created Projects" : "Other Users Created Projects"}
            </h2>
            <button className="text-sm text-[#6b6b80] hover:text-[#7C3AED] transition-colors font-medium">
              View all
            </button>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoadingProjects ? (
              <div className="col-span-full text-center py-8 text-[#6b6b80]">
                Loading projects...
              </div>
            ) : projects.length === 0 ? (
              <div className="col-span-full text-center py-8 text-[#6b6b80]">
                {isLoggedIn ? "No projects yet. Create your first video!" : "Sign in to see your projects"}
              </div>
            ) : (
              projects.map((project) => (
                <div
                  key={project.id}
                  onClick={() => router.push(`/project/${project.id}`)}
                  className="group bg-white rounded-2xl overflow-hidden border border-[#e5e5ea] hover:border-[#c5c5d0] transition-all duration-300 hover:shadow-md cursor-pointer"
                >
                  {/* Thumbnail */}
                  <div className="relative aspect-video bg-[#ECEAF4] overflow-hidden m-3 rounded-xl">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full border-2 border-[#b0b0c0] flex items-center justify-center group-hover:border-[#7C3AED] group-hover:bg-[#7C3AED]/10 transition-all">
                        <Play className="w-5 h-5 text-[#6b6b80] ml-0.5 group-hover:text-[#7C3AED] transition-colors" />
                      </div>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="px-4 pb-4">
                    <h3 className="text-[#1a1a2e] font-semibold mb-1 group-hover:text-[#7C3AED] transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-[#b0b0c0] text-xs">
                      {new Date(project.createdAt).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Create Your Own */}
          <Show when="signed-out">
            <div className="text-center mt-10">
              <SignInButton mode="modal">
                <Button
                  variant="outline"
                  className="border-[#e5e5ea] text-[#6b6b80] hover:text-[#7C3AED] hover:border-[#7C3AED] rounded-full px-6"
                >
                  Create Your Own Video
                </Button>
              </SignInButton>
            </div>
          </Show>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-[#e5e5ea]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-[#7C3AED] flex items-center justify-center">
              <span className="text-white font-bold text-xs">V</span>
            </div>
            <span className="text-[#6b6b80] text-sm">ViDMotionAI</span>
          </div>
          <p className="text-[#b0b0c0] text-sm">
            © 2026 ViDMotionAI. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
        mode={authMode}
      />
    </div>
  );
}