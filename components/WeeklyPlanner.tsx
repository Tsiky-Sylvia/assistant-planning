"use client";

import { useEffect, useState } from "react";
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  useDroppable,
  useDraggable,
} from "@dnd-kit/core";
import TaskCard from "@/components/TaskCard";
import TaskModal from "@/components/TaskModal";
import Spinner from "@/components/Spinner";

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

function DroppableDay({
  day,
  tasks,
  onToggleStatus,
  onDelete,
  onEdit,
}: {
  day: { key: string; label: string };
  tasks: Task[];
  onToggleStatus: (id: string, status: "TODO" | "DONE") => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: day.key });

  return (
    <div className="flex flex-col gap-2">
      <div className="text-center py-2 bg-blue-50 rounded-xl">
        <span className="text-sm font-semibold text-blue-700">{day.label}</span>
        <p className="text-xs text-blue-400">
          {tasks.length} tâche{tasks.length !== 1 ? "s" : ""}
        </p>
      </div>
      <div
        ref={setNodeRef}
        className={`flex flex-col gap-2 min-h-[200px] p-2 rounded-xl transition-colors ${
          isOver ? "bg-blue-50 border-2 border-blue-300 border-dashed" : ""
        }`}
      >
        {tasks.length === 0 ? (
          <div className="flex items-center justify-center h-full border-2 border-dashed border-gray-200 rounded-xl text-gray-300 text-xs">
            Aucune tâche
          </div>
        ) : (
          tasks.map((task) => (
            <DraggableTask
              key={task.id}
              task={task}
              onToggleStatus={onToggleStatus}
              onDelete={onDelete}
              onEdit={onEdit}
            />
          ))
        )}
      </div>
    </div>
  );
}

function DraggableTask({
  task,
  onToggleStatus,
  onDelete,
  onEdit,
}: {
  task: Task;
  onToggleStatus: (id: string, status: "TODO" | "DONE") => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: task.id });

  const style = transform
    ? {
        transform: `translate(${transform.x}px, ${transform.y}px)`,
        zIndex: 999,
        position: "relative" as const,
      }
    : undefined;

  return (
    <div ref={setNodeRef} style={style} className={isDragging ? "opacity-50 scale-105 shadow-lg" : ""}>
      {/* Zone de drag séparée pour éviter les conflits avec les boutons */}
      <div {...listeners} {...attributes} className="cursor-grab active:cursor-grabbing">
        <TaskCard
          task={task}
          onToggleStatus={onToggleStatus}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      </div>
    </div>
  );
}

export default function WeeklyPlanner() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    })
  );

  useEffect(() => {
    fetchTasks();
  }, []);

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

  const getTasksForDay = (day: string) =>
    tasks.filter((task) => task.suggestedDay === day);

  // Toggle statut TODO/DONE
  const handleToggleStatus = async (id: string, newStatus: "TODO" | "DONE") => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t))
    );
    try {
      await fetch(`/api/tasks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
    } catch (error) {
      console.error("Erreur toggle status:", error);
    }
  };

  // Suppression
  const handleDelete = async (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    try {
      await fetch(`/api/tasks/${id}`, { method: "DELETE" });
    } catch (error) {
      console.error("Erreur suppression:", error);
    }
  };

  // Ouvrir modal modification
  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  // Ouvrir modal ajout
  const handleAddManual = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  // Sauvegarder depuis le modal
  const handleModalSave = async (data: Partial<Task>) => {
    if (editingTask) {
      // Modification
      setTasks((prev) =>
        prev.map((t) => (t.id === editingTask.id ? { ...t, ...data } : t))
      );
      try {
        await fetch(`/api/tasks/${editingTask.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
      } catch (error) {
        console.error("Erreur modification:", error);
      }
    } else {
      // Ajout manuel
      try {
        const response = await fetch("/api/tasks/manual", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        const result = await response.json();
        if (response.ok) {
          setTasks((prev) => [...prev, result.task]);
        }
      } catch (error) {
        console.error("Erreur ajout manuel:", error);
      }
    }
  };

  // Drag & drop
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id as string;
    const newDay = over.id as string;
    const task = tasks.find((t) => t.id === taskId);

    if (!task || task.suggestedDay === newDay) return;

    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, suggestedDay: newDay } : t))
    );

    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ suggestedDay: newDay }),
      });
      if (!response.ok) {
        setTasks((prev) =>
          prev.map((t) =>
            t.id === taskId ? { ...t, suggestedDay: task.suggestedDay } : t
          )
        );
      }
    } catch (error) {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskId ? { ...t, suggestedDay: task.suggestedDay } : t
        )
      );
      console.error("Erreur drag & drop:", error);
    }
  };

  // Vider le planning
  const handleReset = async () => {
    if (!confirm("Vider tout le planning ? Cette action est irréversible.")) return;
    const ids = tasks.map((t) => t.id);
    setTasks([]);
    try {
      await Promise.all(ids.map((id) => fetch(`/api/tasks/${id}`, { method: "DELETE" })));
    } catch (error) {
      console.error("Erreur reset planning:", error);
      fetchTasks();
    }
  };

  if (isLoading) {
    return <Spinner text="Chargement du planning..." />;
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
        ⚠️ {error}
      </div>
    );
  }

  return (
    <>
      <h2 className="text-xl font-bold text-gray-700 mb-4">
        Planning de la semaine
      </h2>
      <div className="flex justify-between items-center mb-4"  >
        <div className="flex gap-3">
          <button
            onClick={handleAddManual}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            + Ajouter une tâche
          </button>
          {tasks.length > 0 && (
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-red-50 text-red-600 rounded-xl text-sm font-medium hover:bg-red-100 transition-colors"
            >
              🗑 Vider le planning
            </button>
          )}
        </div>
      </div>

      {tasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-40 gap-2 text-gray-400">
          <span className="text-4xl">📅</span>
          <p className="text-sm">Aucune tâche pour cette semaine.</p>
          <p className="text-sm">Génère ton planning ci-dessus pour commencer.</p>
        </div>
      ) : (
        <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
          <div className="w-full overflow-x-auto">
            <div className="grid grid-cols-7 gap-3 min-w-[900px]">
              {days.map((day) => (
                <DroppableDay
                  key={day.key}
                  day={day}
                  tasks={getTasksForDay(day.key)}
                  onToggleStatus={handleToggleStatus}
                  onDelete={handleDelete}
                  onEdit={handleEdit}
                />
              ))}
            </div>
          </div>
        </DndContext>
      )}

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTask(null);
        }}
        onSave={handleModalSave}
        task={editingTask}
      />
    </>
  );
}