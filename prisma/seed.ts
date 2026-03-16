import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL || "";

const pool = new Pool({
  connectionString: connectionString,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

async function main() {
  const user = await prisma.user.upsert({
    where: { email: "demo@vidmotion.ai" },
    update: {},
    create: {
      email: "demo@vidmotion.ai",
      name: "Demo User",
      password: "demo123",
    },
  });

  const project1 = await prisma.project.create({
    data: {
      title: "Neon Product Promo",
      prompt: "Neon product promo video with glowing effects",
      duration: "15s",
      aspectRatio: "16:9",
      status: "completed",
      userId: user.id,
    },
  });

  const project2 = await prisma.project.create({
    data: {
      title: "Fitness Reel Ad",
      prompt: "Fitness app promotional reel with energetic music",
      duration: "10s",
      aspectRatio: "9:16",
      status: "completed",
      userId: user.id,
    },
  });

  const project3 = await prisma.project.create({
    data: {
      title: "Startup App Showcase",
      prompt: "Startup app showcase with modern UI animations",
      duration: "20s",
      aspectRatio: "16:9",
      status: "completed",
      userId: user.id,
    },
  });

  await prisma.generatedVideo.createMany({
    data: [
      {
        title: "Neon Promo v1",
        prompt: "Neon product promo video with glowing effects",
        duration: "15s",
        aspectRatio: "16:9",
        model: "default",
        quality: "standard",
        status: "completed",
        projectId: project1.id,
      },
      {
        title: "Fitness Reel v1",
        prompt: "Fitness app promotional reel with energetic music",
        duration: "10s",
        aspectRatio: "9:16",
        model: "default",
        quality: "high",
        status: "completed",
        projectId: project2.id,
      },
      {
        title: "App Showcase v1",
        prompt: "Startup app showcase with modern UI animations",
        duration: "20s",
        aspectRatio: "16:9",
        model: "default",
        quality: "standard",
        status: "completed",
        projectId: project3.id,
      },
    ],
  });

  console.log("Seed data created successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });