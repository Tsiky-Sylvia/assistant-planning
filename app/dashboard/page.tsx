import { UserButton } from "@clerk/nextjs";
import TaskInput from "@/components/TaskInput";

export default function DashboardPage() {
  return (
    <main className="flex min-h-screen flex-col p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Mon Planning</h1>
        <UserButton />
      </div>
      <TaskInput />
    </main>
  );
}