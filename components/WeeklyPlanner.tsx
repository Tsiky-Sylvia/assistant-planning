"use client";

import { useEffect, useState } from "react";
import TaskCard from "@/components/TaskCard";

type Task = {
  id: string;
  title: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
  category: string;
  estimatedDuration: number;
  suggestedDay: string;
  status: "TODO" | "DONE";
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

export default function WeeklyPlanner() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch("/api/tasks");
        const data = await response.json();

        if (!response.ok) {
          setError(data.error ?? "Erreur lors du chargement.");
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

    fetchTasks();
  }, []);

  const getTasksForDay = (day: string) =>
    tasks.filter((task) => task.suggestedDay === day);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-40 text-gray-400">
        Chargement du planning...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
        ⚠️ {error}
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-40 gap-2 text-gray-400">
        <span className="text-4xl">📅</span>
        <p className="text-sm">Aucune tâche pour cette semaine.</p>
        <p className="text-sm">Génère ton planning ci-dessus pour commencer.</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <div className="grid grid-cols-7 gap-3 min-w-[900px]">
        {days.map((day) => (
          <div key={day.key} className="flex flex-col gap-2">
            <div className="text-center py-2 bg-blue-50 rounded-xl">
              <span className="text-sm font-semibold text-blue-700">
                {day.label}
              </span>
              <p className="text-xs text-blue-400">
                {getTasksForDay(day.key).length} tâche
                {getTasksForDay(day.key).length !== 1 ? "s" : ""}
              </p>
            </div>
            <div className="flex flex-col gap-2 min-h-[200px]">
              {getTasksForDay(day.key).length === 0 ? (
                <div className="flex items-center justify-center h-full border-2 border-dashed border-gray-200 rounded-xl text-gray-300 text-xs">
                  Aucune tâche
                </div>
              ) : (
                getTasksForDay(day.key).map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}