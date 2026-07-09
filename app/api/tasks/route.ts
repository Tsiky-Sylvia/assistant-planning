import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@/app/generated/prisma";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Non authentifié" },
        { status: 401 }
      );
    }

    // Trouver l'utilisateur en base via clerkId
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé en base" },
        { status: 404 }
      );
    }

    const { tasks, rawInput } = await req.json();

    if (!tasks || !Array.isArray(tasks) || tasks.length === 0) {
      return NextResponse.json(
        { error: "Aucune tâche à sauvegarder" },
        { status: 400 }
      );
    }

    // Sauvegarder toutes les tâches en base
    const savedTasks = await prisma.task.createMany({
      data: tasks.map((task: {
        title: string;
        priority: "LOW" | "MEDIUM" | "HIGH";
        category: string;
        estimatedDuration: number;
        suggestedDay: string;
      }, index: number) => ({
        title: task.title,
        rawInput: rawInput,
        priority: task.priority,
        category: task.category,
        estimatedDuration: task.estimatedDuration,
        suggestedDay: task.suggestedDay,
        position: index,
        userId: user.id,
      })),
    });

    return NextResponse.json({ savedTasks }, { status: 201 });

  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return NextResponse.json(
          { error: "Une tâche identique existe déjà." },
          { status: 409 }
        );
      }
      if (error.code === "P2025") {
        return NextResponse.json(
          { error: "Enregistrement introuvable." },
          { status: 404 }
        );
      }
    }
    console.error("Erreur sauvegarde tâches:", error);
    return NextResponse.json(
      { error: "Erreur lors de la sauvegarde" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Non authentifié" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé en base" },
        { status: 404 }
      );
    }

    const tasks = await prisma.task.findMany({
      where: { userId: user.id },
      orderBy: [
        { suggestedDay: "asc" },
        { position: "asc" },
      ],
    });

    return NextResponse.json({ tasks });

  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return NextResponse.json(
          { error: "Une tâche identique existe déjà." },
          { status: 409 }
        );
      }
      if (error.code === "P2025") {
        return NextResponse.json(
          { error: "Enregistrement introuvable." },
          { status: 404 }
        );
      }
    }
    console.error("Erreur chargement tâches:", error);
    return NextResponse.json(
      { error: "Erreur lors de la chargement" },
      { status: 500 }
    );
  }
}