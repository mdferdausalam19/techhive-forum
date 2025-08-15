import { FaQuoteLeft, FaQuoteRight } from "react-icons/fa";

export default function Testimonials() {
  const testimonials = [
    {
      name: "Sarah K.",
      quote:
        "Premium gave me access to deep discussions and an ad-free experience. It’s worth every penny!",
      avatar: "https://i.pravatar.cc/100?img=5",
    },
    {
      name: "Mike T.",
      quote:
        "Smart Discussions and Gold badge make me feel like part of an exclusive tech tribe!",
      avatar: "https://i.pravatar.cc/100?img=8",
    },
  ];
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 mb-6">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          What Our Members Say
        </h2>
        <p className="text-gray-600">
          Hear from our community members about their experiences with TechHive.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {testimonials.map((t) => (
          <div
            key={t.name}
            className="bg-white rounded-lg shadow p-6 border border-blue-300 flex flex-col items-center"
          >
            <img
              src={t.avatar}
              alt={t.name}
              className="w-16 h-16 rounded-full mb-3 border-2 border-gray-200"
            />
            <p className="text-gray-700 italic mb-2">{t.quote}</p>
            <span className="font-semibold text-gray-900">{t.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
