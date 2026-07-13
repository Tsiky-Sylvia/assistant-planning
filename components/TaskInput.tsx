"use client";

import { useState } from "react";

type Task = {
  title: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
  category: string;
  estimatedDuration: number;
  suggestedDay: string;
};

const priorityLabel: Record<string, { label: string; color: string }> = {
  HIGH: { label: "Haute", color: "bg-red-100 text-red-700" },
  MEDIUM: { label: "Moyenne", color: "bg-yellow-100 text-yellow-700" },
  LOW: { label: "Basse", color: "bg-green-100 text-green-700" },
};

const dayLabel: Record<string, string> = {
  monday: "Lundi",
  tuesday: "Mardi",
  wednesday: "Mercredi",
  thursday: "Jeudi",
  friday: "Vendredi",
  saturday: "Samedi",
  sunday: "Dimanche",
};

export default function TaskInput({ onSaveSuccess }: { onSaveSuccess?: () => void }) {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleGenerate = async () => {
    if (!input.trim()) return;
    setIsLoading(true);
    setError(null);
    setSaved(false);
    setTasks([]);

    try {
      const response = await fetch("/api/tasks/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rawInput: input }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Une erreur est survenue.");
        return;
      }

      setTasks(data.tasks);
    } catch (error) {
      setError("Erreur réseau, vérifiez votre connexion.");
      console.error("Erreur:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = (index: number) => {
    setTasks((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (tasks.length === 0) return;
    setIsSaving(true);
    setError(null);

    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tasks, rawInput: input }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Erreur lors de la sauvegarde.");
        return;
      }

      setSaved(true);
      setTasks([]);
      setInput("");
      onSaveSuccess?.(); 
    } catch (error) {
      setError("Erreur réseau lors de la sauvegarde.");
      console.error("Erreur:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Colonne gauche — saisie */}
      <div className="flex flex-col gap-4 w-full lg:w-1/2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ex: finir le rapport client, appeler le plombier, préparer la présentation de vendredi..."
          className="w-full h-48 p-4 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 bg-white placeholder-gray-400"
          maxLength={1000}
        />
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-400">
            {input.length}/1000 caractères
          </span>
          <button
            onClick={handleGenerate}
            disabled={isLoading || !input.trim()}
            className="px-6 py-2 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Génération...
              </>
            ) : (
              "✨ Générer mon planning"
            )}
          </button>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
            ⚠️ {error}
          </div>
        )}

        {saved && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-green-600 text-sm">
            ✅ Planning sauvegardé avec succès !
          </div>
        )}
      </div>

      {/* Colonne droite — tâches générées */}
      <div className="w-full lg:w-1/2">
        {tasks.length > 0 ? (
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-semibold text-gray-700">
                Tâches générées ({tasks.length})
              </h3>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-4 py-2 bg-green-600 text-white rounded-xl text-sm font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSaving ? "Sauvegarde..." : "Valider et sauvegarder"}
              </button>
            </div>
            <div className="flex flex-col gap-2 max-h-80 overflow-y-auto pr-1">
              {tasks.map((task, index) => (
                <div
                  key={index}
                  className="flex flex-col gap-2 p-3 border border-gray-200 rounded-xl bg-gray-50"
                >
                  <div className="flex justify-between items-start">
                    <span className="text-sm font-medium text-gray-800">
                      {task.title}
                    </span>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${priorityLabel[task.priority].color}`}
                      >
                        {priorityLabel[task.priority].label}
                      </span>
                      <button
                        onClick={() => handleDelete(index)}
                        className="text-gray-400 hover:text-red-500 transition-colors text-xs"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                  <div className="flex gap-3 text-xs text-gray-500">
                    <span>📅 {dayLabel[task.suggestedDay] ?? task.suggestedDay}</span>
                    <span>⏱ {task.estimatedDuration} min</span>
                    <span>🏷 {task.category}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full min-h-48 border-2 border-dashed border-gray-200 rounded-xl text-gray-300 gap-2">
            <span className="text-3xl">✨</span>
            <p className="text-sm">Les tâches générées apparaîtront ici</p>
          </div>
        )}
      </div>
    </div>
  );
}