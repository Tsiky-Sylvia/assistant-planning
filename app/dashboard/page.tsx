"use client";

import { useState } from "react";
import { UserButton } from "@clerk/nextjs";
import TaskInput from "@/components/TaskInput";
import WeeklyPlanner from "@/components/WeeklyPlanner";

export default function DashboardPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSaveSuccess = () => {
    setRefreshKey((prev) => prev +1);
  }
  
  return (
    <main className="flex min-h-screen flex-col p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Mon Planning</h1>
        <UserButton />
      </div>
      <TaskInput onSaveSuccess={handleSaveSuccess} />

      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-bold text-gray-700">
          Planning de la semaine
        </h2>
        <WeeklyPlanner key={refreshKey}/>
      </div>
    </main>
  );
}