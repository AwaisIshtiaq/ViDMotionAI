import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { Play } from "lucide-react";

export default async function ProjectsPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  if (!user) {
    redirect("/sign-in");
  }

  const projects = await prisma.project.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-[#F0EEF6] p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-[#1a1a2e]">Your Projects</h1>
          <Link
            href="/"
            className="px-4 py-2 bg-[#7C3AED] text-white rounded-full text-sm font-medium hover:bg-[#6D28D9] transition-colors"
          >
            Create New
          </Link>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-[#6b6b80] mb-4">No projects yet</p>
            <Link
              href="/"
              className="text-[#7C3AED] hover:underline"
            >
              Create your first video
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Link
                key={project.id}
                href={`/project/${project.id}`}
                className="group bg-white rounded-2xl overflow-hidden border border-[#e5e5ea] hover:border-[#c5c5d0] transition-all duration-300 hover:shadow-md"
              >
                <div className="relative aspect-video bg-[#ECEAF4] overflow-hidden m-3 rounded-xl">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full border-2 border-[#b0b0c0] flex items-center justify-center group-hover:border-[#7C3AED] group-hover:bg-[#7C3AED]/10 transition-all">
                      <Play className="w-5 h-5 text-[#6b6b80] ml-0.5 group-hover:text-[#7C3AED] transition-colors" />
                    </div>
                  </div>
                </div>
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
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}