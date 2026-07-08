import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
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
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    const { title, priority, category, estimatedDuration, suggestedDay } =
      await req.json();

    if (!title?.trim()) {
      return NextResponse.json(
        { error: "Le titre est obligatoire" },
        { status: 400 }
      );
    }

    const task = await prisma.task.create({
      data: {
        title,
        priority: priority ?? "MEDIUM",
        category: category ?? "perso",
        estimatedDuration: estimatedDuration ?? 30,
        suggestedDay: suggestedDay ?? "monday",
        userId: user.id,
      },
    });

    return NextResponse.json({ task }, { status: 201 });
  } catch (error) {
    console.error("Erreur ajout manuel:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'ajout" },
      { status: 500 }
    );
  }
}