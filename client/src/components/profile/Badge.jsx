export default function Badge({ type }) {
  if (!type) return null;
  const color =
    type === "Gold"
      ? "bg-yellow-400 text-yellow-900"
      : "bg-yellow-700 text-yellow-100";
  return (
    <span
      className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${color}`}
    >
      {type}
    </span>
  );
}
