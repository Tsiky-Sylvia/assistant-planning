"use client";

export default function GlobalError({
  reset,
}: {
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-6 p-8 text-center">
          <span className="text-6xl">💥</span>
          <h1 className="text-3xl font-bold text-gray-800">
            Erreur critique
          </h1>
          <p className="text-gray-500 max-w-sm">
            Une erreur critique est survenue. Veuillez réessayer.
          </p>
          <button
            onClick={reset}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
          >
            Réessayer
          </button>
        </main>
      </body>
    </html>
  );
}