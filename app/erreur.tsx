"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Erreur globale:", error);
  }, [error]);

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-6 p-8 text-center">
      <span className="text-6xl">⚠️</span>
      <h1 className="text-3xl font-bold text-gray-800">Une erreur est survenue</h1>
      <p className="text-gray-500 max-w-sm">
        Quelque chose s'est mal passé. Tu peux réessayer ou retourner à l'accueil.
      </p>
      <div className="flex gap-4">
        <button
          onClick={reset}
          className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
        >
          Réessayer
        </button>
        <Link
          href="/"
          className="px-6 py-3 bg-white text-gray-700 border border-gray-200 rounded-xl font-medium hover:bg-gray-50 transition-colors"
        >
          Retour à l'accueil
        </Link>
      </div>
    </main>
  );
}