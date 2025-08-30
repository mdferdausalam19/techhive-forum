export default function StatCard({
  label,
  value,
  icon: Icon,
  textColor,
  borderColor,
}) {
  return (
    <div
      className={`rounded-xl shadow-lg p-6 flex flex-col bg-gradient-to-br from-blue-50 to-blue-100 ${textColor} transition-transform hover:scale-[1.02] border-2 ${borderColor} overflow-hidden`}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium opacity-90 mb-1">{label}</p>
          <p className="text-3xl font-bold">{value}</p>
        </div>
        <div className="bg-white/20 p-3 rounded-lg border">
          <span className="text-2xl">
            <Icon />
          </span>
        </div>
      </div>
    </div>
  );
}
