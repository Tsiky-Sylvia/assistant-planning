import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const { userId } = await auth();

  // Si déjà connecté, rediriger vers le dashboard
  if (userId) redirect("/dashboard");

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-2xl">📅</span>
          <span className="font-bold text-gray-800">PlanifIA</span>
        </div>
        <div className="flex gap-3">
          <Link
            href="/sign-in"
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
          >
            Connexion
          </Link>
          <Link
            href="/sign-up"
            className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Commencer gratuitement
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="flex flex-col items-center justify-center flex-1 px-8 py-20 text-center gap-6">
        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-sm font-medium">
          <span>✨</span>
          <span>Planification intelligente avec l'IA</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 max-w-2xl leading-tight">
          Transforme tes tâches en planning organisé
        </h1>
        <p className="text-lg text-gray-500 max-w-xl">
          Décris ce que tu as à faire en langage naturel. L'IA analyse, priorise
          et distribue tes tâches sur la semaine automatiquement.
        </p>
        <div className="flex gap-4 flex-wrap justify-center">
          <Link
            href="/sign-up"
            className="px-8 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors text-lg"
          >
            Essayer gratuitement
          </Link>
          <Link
            href="/sign-in"
            className="px-8 py-3 bg-white text-gray-700 border border-gray-200 rounded-xl font-medium hover:bg-gray-50 transition-colors text-lg"
          >
            Se connecter
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="px-8 py-16 bg-white">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: "🧠",
              title: "IA intégrée",
              description:
                "Décris tes tâches en texte libre, l'IA les structure et les priorise automatiquement.",
            },
            {
              icon: "📆",
              title: "Planning hebdomadaire",
              description:
                "Visualise toutes tes tâches sur une vue semaine claire et interactive.",
            },
            {
              icon: "🖱️",
              title: "Drag & drop",
              description:
                "Réorganise tes tâches entre les jours d'un simple glisser-déposer.",
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="flex flex-col gap-3 p-6 bg-gray-50 rounded-2xl"
            >
              <span className="text-3xl">{feature.icon}</span>
              <h3 className="font-semibold text-gray-800">{feature.title}</h3>
              <p className="text-sm text-gray-500">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="px-8 py-6 text-center text-sm text-gray-400 border-t border-gray-100">
        Construit avec Next.js, Prisma, Clerk et l'IA Groq
      </footer>
    </main>
  );
}