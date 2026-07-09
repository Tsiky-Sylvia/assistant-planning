"use client";

import { useState } from "react";
import { UserButton } from "@clerk/nextjs";
import TaskInput from "@/components/TaskInput";
import WeeklyPlanner from "@/components/WeeklyPlanner";

export default function DashboardPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSaveSuccess = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800">Mon Planning</h1>
        <UserButton />
      </div>

      <div className="p-8 flex flex-col gap-8">
        {/* Section saisie — split view sur desktop */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            ✨ Générer mon planning avec l'IA
          </h2>
          <TaskInput onSaveSuccess={handleSaveSuccess} />
        </div>

        {/* Section planning */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <WeeklyPlanner key={refreshKey} />
        </div>
      </div>
    </main>
  );
}