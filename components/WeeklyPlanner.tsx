"use client";

import { useEffect, useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  useDroppable,
  useDraggable,
} from "@dnd-kit/core";
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

// Composant colonne droppable
function DroppableDay({
  day,
  tasks,
  activeId,
}: {
  day: { key: string; label: string };
  tasks: Task[];
  activeId: string | null;
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
        {tasks.length === 0 && !isOver ? (
          <div className="flex items-center justify-center h-full border-2 border-dashed border-gray-200 rounded-xl text-gray-300 text-xs">
            Aucune tâche
          </div>
        ) : (
          tasks.map((task) => (
            <DraggableTask key={task.id} task={task} activeId={activeId} />
          ))
        )}
      </div>
    </div>
  );
}

// Composant tâche draggable
function DraggableTask({
  task,
  activeId,
}: {
  task: Task;
  activeId: string | null;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: task.id });

  const style = transform
    ? { transform: `translate(${transform.x}px, ${transform.y}px)` }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`cursor-grab active:cursor-grabbing ${
        isDragging ? "opacity-30" : ""
      }`}
    >
      <TaskCard task={task} />
    </div>
  );
}

export default function WeeklyPlanner() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  const pointSensor = useSensor(PointerSensor, {
        activationConstraint: {
        distance: 8,
        },
    });
    const touchsens = useSensor(TouchSensor, {
        activationConstraint: {
        delay: 200,
        tolerance: 5,
        },
    });
  const sensors = useSensors(
    pointSensor,
    touchsens
    );

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

  const activeTask = tasks.find((task) => task.id === activeId);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    console.log(active, over);

    if (!over) return;

    const taskId = active.id as string;
    const newDay = over.id as string;
    const task = tasks.find((t) => t.id === taskId);

    console.log(task);

    if (!task || task.suggestedDay === newDay) return;

    // Mise à jour optimiste de l'UI
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId ? { ...t, suggestedDay: newDay } : t
      )
    );

    // Persistance en base
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ suggestedDay: newDay }),
      });

      if (!response.ok) {
        // Rollback si erreur
        setTasks((prev) =>
          prev.map((t) =>
            t.id === taskId ? { ...t, suggestedDay: task.suggestedDay } : t
          )
        );
      }

    } catch (error) {
      // Rollback si erreur réseau
      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskId ? { ...t, suggestedDay: task.suggestedDay } : t
        )
      );
      console.error("Erreur mise à jour:", error);
    }finally{
        setActiveId(null);
    }
  };

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
    <DndContext
      sensors={sensors}
      onDragStart={(event) => setActiveId(event.active.id as string)}
      onDragEnd={handleDragEnd}
    >
      <div className="w-full overflow-x-auto">
        <div className="grid grid-cols-7 gap-3 min-w-[900px]">
          {days.map((day) => (
            <DroppableDay
              key={day.key}
              day={day}
              tasks={getTasksForDay(day.key)}
              activeId={activeId}
            />
          ))}
        </div>
      </div>

      <DragOverlay>
        {activeTask ? <TaskCard task={activeTask} /> : null}
      </DragOverlay>
    </DndContext>
  );
}