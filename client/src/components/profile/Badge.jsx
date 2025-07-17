import { SlBadge } from "react-icons/sl";

export default function Badge({ type }) {
  if (!type) return null;

  const color =
    type === "Gold"
      ? "bg-yellow-300 text-yellow-800 border border-yellow-400"
      : "bg-amber-600 text-white border border-amber-700";

  return (
    <span
      className={`inline-flex items-center px-2 py-1 rounded text-xs font-semibold ${color}`}
    >
      <SlBadge className="w-4 h-4 mr-1" />
      {type}
    </span>
  );
}
