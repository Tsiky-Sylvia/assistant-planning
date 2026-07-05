import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import { PLANNING_SYSTEM_PROMPT } from "@/lib/prompts";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const { rawInput } = await req.json();

    if (!rawInput || rawInput.trim() === "") {
      return NextResponse.json(
        { error: "Input vide" },
        { status: 400 }
      );
    }

    if (rawInput.length > 1000) {
      return NextResponse.json(
        { error: "Input trop long (max 1000 caractères)" },
        { status: 400 }
      );
    }

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: PLANNING_SYSTEM_PROMPT },
        { role: "user", content: rawInput },
      ],
      temperature: 0.3,
      response_format: { type: "json_object" },
    });

    const text = completion.choices[0]?.message?.content ?? "";
    console.log("Réponse brute Groq:", text);

    const parsed = JSON.parse(text);
    const tasks = parsed.tasks ?? parsed;

    if (!Array.isArray(tasks)) {
      throw new Error("La réponse n'est pas un tableau JSON valide");
    }

    return NextResponse.json({ tasks });

  } catch (error) {
    console.error("Erreur génération planning:", error);
    return NextResponse.json(
      { error: "Erreur lors de la génération du planning" },
      { status: 500 }
    );
  }
}