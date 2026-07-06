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

export default function TaskCard({ task }: { task: Task }) {
  return (
    <div
      className={`flex flex-col gap-2 p-3 border rounded-xl bg-white shadow-sm ${
        task.status === "DONE" ? "opacity-50" : ""
      }`}
    >
      <span
        className={`text-xs px-2 py-0.5 rounded-full font-medium self-start ${priorityLabel[task.priority].color}`}
      >
        {priorityLabel[task.priority].label}
      </span>
      <span
        className={`text-sm font-medium text-gray-800 ${
          task.status === "DONE" ? "line-through" : ""
        }`}
      >
        {task.title}
      </span>
      <div className="flex gap-3 text-xs text-gray-500">
        <span>⏱ {task.estimatedDuration} min</span>
        <span>🏷 {task.category}</span>
      </div>
    </div>
  );
}