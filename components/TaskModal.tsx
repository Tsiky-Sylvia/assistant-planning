"use client";

import { useState, useEffect } from "react";

type Task = {
  id: string;
  title: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
  category: string;
  estimatedDuration: number;
  suggestedDay: string;
  status: "TODO" | "DONE";
};

type TaskModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Partial<Task>) => void;
  task?: Task | null; // null = ajout, Task = modification
};

const days = [
  { key: "monday", label: "Lundi" },
  { key: "tuesday", label: "Mardi" },
  { key: "wednesday", label: "Mercredi" },
  { key: "thursday", label: "Jeudi" },
  { key: "friday", label: "Vendredi" },
  { key: "saturday", label: "Samedi" },
  { key: "sunday", label: "Dimanche" },
];

export default function TaskModal({
  isOpen,
  onClose,
  onSave,
  task,
}: TaskModalProps) {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<"LOW" | "MEDIUM" | "HIGH">("MEDIUM");
  const [category, setCategory] = useState("");
  const [estimatedDuration, setEstimatedDuration] = useState(30);
  const [suggestedDay, setSuggestedDay] = useState("monday");

  // Pré-remplir si modification
  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setPriority(task.priority);
      setCategory(task.category);
      setEstimatedDuration(task.estimatedDuration);
      setSuggestedDay(task.suggestedDay);
    } else {
      setTitle("");
      setPriority("MEDIUM");
      setCategory("");
      setEstimatedDuration(30);
      setSuggestedDay("monday");
    }
  }, [task, isOpen]);

  const handleSave = () => {
    if (!title.trim()) return;
    onSave({
      title,
      priority,
      category,
      estimatedDuration,
      suggestedDay,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md flex flex-col gap-4 p-6">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-800">
            {task ? "Modifier la tâche" : "Ajouter une tâche"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Titre */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Titre</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex: Appeler le client"
            className="p-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Priorité */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Priorité</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as "LOW" | "MEDIUM" | "HIGH")}
            className="p-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="HIGH">Haute</option>
            <option value="MEDIUM">Moyenne</option>
            <option value="LOW">Basse</option>
          </select>
        </div>

        {/* Catégorie */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Catégorie</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Ex: travail, perso, santé..."
            className="p-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Durée estimée */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">
            Durée estimée (minutes)
          </label>
          <input
            type="number"
            value={estimatedDuration}
            onChange={(e) => setEstimatedDuration(Number(e.target.value))}
            min={5}
            max={480}
            className="p-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Jour */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Jour</label>
          <select
            value={suggestedDay}
            onChange={(e) => setSuggestedDay(e.target.value)}
            className="p-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {days.map((day) => (
              <option key={day.key} value={day.key}>
                {day.label}
              </option>
            ))}
          </select>
        </div>

        {/* Boutons */}
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={handleSave}
            disabled={!title.trim()}
            className="px-6 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {task ? "Sauvegarder" : "Ajouter"}
          </button>
        </div>
      </div>
    </div>
  );
}