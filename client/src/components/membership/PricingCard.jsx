import useRole from "../../hooks/useRole";
import LoadingSpinner from "../shared/LoadingSpinner";

const features = [
  { name: "Access to Public Forums", free: true, premium: true },
  { name: "Create Posts", free: true, premium: true },
  { name: "Commenting on Posts", free: true, premium: true },
  { name: "AI Assistant", free: false, premium: true },
  { name: "Priority Support", free: false, premium: true },
  { name: "Early Access to New Features", free: false, premium: true },
  { name: "Gold Profile Badge", free: false, premium: true },
];

export default function PricingCard({ onUpgrade }) {
  const { role, isLoading } = useRole();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8 mb-10 border border-blue-100">
        <div className="flex flex-col md:flex-row items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-blue-700 mb-2">
              Premium Membership
            </h2>
            <p className="text-gray-600 mb-2">
              All the essential tools for serious community members
            </p>
          </div>
          <div className="text-right">
            <span className="text-4xl font-extrabold text-blue-600 mr-2">
              $499
            </span>
            <span className="text-lg text-gray-500">/life-time</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full mb-6 border-t border-b border-blue-100">
            <thead>
              <tr>
                <th className="text-left py-2">Features</th>
                <th className="text-center py-2">Free</th>
                <th className="text-center py-2">Premium</th>
              </tr>
            </thead>
            <tbody>
              {features.map((f) => (
                <tr key={f.name}>
                  <td className="py-2 text-gray-700">{f.name}</td>
                  <td className="text-center">
                    {f.free ? (
                      <span className="text-green-600 font-bold">✓</span>
                    ) : (
                      <span className="text-gray-300">—</span>
                    )}
                  </td>
                  <td className="text-center">
                    {f.premium ? (
                      <span className="text-blue-600 font-bold">✓</span>
                    ) : (
                      <span className="text-gray-300">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="text-center">
          {role === "General" ? (
            <button
              onClick={onUpgrade}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200 ease-in-out transform hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Upgrade Now
            </button>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
}
