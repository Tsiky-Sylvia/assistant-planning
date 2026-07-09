"use client";

type Task = {
  id: string;
  title: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
  category: string;
  estimatedDuration: number;
  suggestedDay: string;
  status: "TODO" | "DONE";
};

const priorityLabel: Record<string, { label: string; color: string }> = {
  HIGH: { label: "Haute", color: "bg-red-100 text-red-700" },
  MEDIUM: { label: "Moyenne", color: "bg-yellow-100 text-yellow-700" },
  LOW: { label: "Basse", color: "bg-green-100 text-green-700" },
};

type TaskCardProps = {
  task: Task;
  onToggleStatus?: (id: string, status: "TODO" | "DONE") => void;
  onDelete?: (id: string) => void;
  onEdit?: (task: Task) => void;
};

export default function TaskCard({
  task,
  onToggleStatus,
  onDelete,
  onEdit,
}: TaskCardProps) {
  return (
    <div
      className={`flex flex-col gap-2 p-3 border rounded-xl bg-white shadow-sm transition-opacity ${
        task.status === "DONE" ? "opacity-50" : ""
      }`}
    >
      {/* Badge priorité */}
      <span
        className={`text-xs px-2 py-0.5 rounded-full font-medium self-start ${priorityLabel[task.priority].color}`}
      >
        {priorityLabel[task.priority].label}
      </span>

      {/* Titre + checkbox */}
      <div className="flex items-start gap-2">
        <input
          type="checkbox"
          checked={task.status === "DONE"}
          onChange={() =>
            onToggleStatus?.(
              task.id,
              task.status === "TODO" ? "DONE" : "TODO"
            )
          }
          className="mt-0.5 cursor-pointer accent-blue-600"
        />
        <span
          className={`text-sm font-medium text-gray-800 flex-1 ${
            task.status === "DONE" ? "line-through text-gray-400" : ""
          }`}
        >
          {task.title}
        </span>
      </div>

      {/* Infos */}
      <div className="flex gap-3 text-xs text-gray-500">
        <span>⏱ {task.estimatedDuration} min</span>
        <span>🏷 {task.category}</span>
      </div>

      {/* Actions */}
      <div className="flex flex-col lg:flex-row gap-2 justify-end">
        <button
          onClick={() => onEdit?.(task)}
          className="text-xs text-blue-400 hover:text-blue-600 transition-colors w-full lg:w-1/2"
        >
          ✏️ Modifier
        </button>
        <button
          onClick={() => onDelete?.(task.id)}
          className="text-xs text-gray-400 hover:text-red-500 transition-colors w-full lg:w-1/2"
        >
          ✕ Supprimer
        </button>
      </div>
    </div>
  );
}