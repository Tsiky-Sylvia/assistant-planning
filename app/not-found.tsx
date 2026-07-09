import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-6 p-8 text-center">
      <span className="text-6xl">😕</span>
      <h1 className="text-3xl font-bold text-gray-800">Page introuvable</h1>
      <p className="text-gray-500 max-w-sm">
        La page que tu cherches n'existe pas ou a été déplacée.
      </p>
      <Link
        href="/"
        className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
      >
        Retour à l'accueil
      </Link>
    </main>
  );
}