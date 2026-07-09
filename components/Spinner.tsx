export default function Spinner({ text = "Chargement..." }: { text?: string }) {
  return (
    <div className="flex items-center justify-center gap-3 text-gray-400 h-40">
      <div className="w-5 h-5 border-2 border-gray-200 border-t-blue-500 rounded-full animate-spin" />
      <span className="text-sm">{text}</span>
    </div>
  );
}