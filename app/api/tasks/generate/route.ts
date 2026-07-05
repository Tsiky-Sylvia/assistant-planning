import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { rawInput } = await req.json();

  if (!rawInput || rawInput.trim() === "") {
    return NextResponse.json(
      { error: "Input vide" },
      { status: 400 }
    );
  }

  // Mock — sera remplacé par l'appel IA au Jour 4
  const mockTasks = [
    {
      title: "Finir le rapport client",
      priority: "HIGH",
      category: "travail",
      estimatedDuration: 120,
      suggestedDay: "monday",
    },
    {
      title: "Appeler le plombier",
      priority: "MEDIUM",
      category: "perso",
      estimatedDuration: 15,
      suggestedDay: "tuesday",
    },
    {
      title: "Préparer la présentation",
      priority: "HIGH",
      category: "travail",
      estimatedDuration: 90,
      suggestedDay: "wednesday",
    },
  ];

  return NextResponse.json({ tasks: mockTasks });
}