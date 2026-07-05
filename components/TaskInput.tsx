"use client";

import { useState } from "react";

export default function TaskInput() {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    if (!input.trim()) return;
    setIsLoading(true);

    try {
      const response = await fetch("/api/tasks/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rawInput: input }),
      });

      const data = await response.json();
      console.log("Tâches générées:", data);
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full max-w-2xl">
      <label className="text-lg font-semibold text-gray-700">
        Qu'as-tu à faire cette semaine ?
      </label>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ex: finir le rapport client, appeler le plombier, préparer la présentation de vendredi..."
        className="w-full h-40 p-4 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 placeholder-gray-400"
        maxLength={1000}
      />
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-400">
          {input.length}/1000 caractères
        </span>
        <button
          onClick={handleGenerate}
          disabled={isLoading || !input.trim()}
          className="px-6 py-2 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? "Génération..." : "Générer mon planning"}
        </button>
      </div>
    </div>
  );
}