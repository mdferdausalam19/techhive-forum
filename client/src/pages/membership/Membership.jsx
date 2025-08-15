import { useState } from "react";

const features = [
  { name: "Access to Public Forums", free: true, premium: true },
  { name: "Create Posts", free: true, premium: true },
  { name: "Commenting on Posts", free: true, premium: true },
  { name: "AI Assistant", free: false, premium: true },
  { name: "Priority Support", free: false, premium: true },
  { name: "Early Access to Features", free: false, premium: true },
  { name: "Gold Profile Badge", free: false, premium: true },
];

const faqs = [
  {
    question: "What payment methods are supported?",
    answer:
      "You can pay using any major credit/debit card or securely via Stripe. Your Premium access is activated instantly.",
  },
  {
    question: "Can I cancel anytime?",
    answer:
      "Yes, you can cancel your subscription at any time from your account dashboard. No questions asked.",
  },
  {
    question: "Do I lose Premium features immediately after cancellation?",
    answer:
      "No, you'll retain access to Premium features until the end of your current billing cycle.",
  },
];

export default function Membership() {
  const [openFAQ, setOpenFAQ] = useState(null);
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Hero Section */}
      <div className="text-center py-14 bg-gradient-to-r from-blue-600 to-blue-400 text-white mb-10 shadow">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl font-extrabold mb-3">
            Upgrade to TechHive Premium
          </h1>
          <p className="text-lg max-w-xl mx-auto">
            Unlock exclusive features, dive into AI-enhanced discussions, and
            enjoy priority-supported community experience.
          </p>
        </div>
      </div>

      {/* Pricing Card */}
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
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg text-lg shadow transition">
              Upgrade Now
            </button>
          </div>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-3xl mx-auto mb-16">
          <h4 className="text-2xl font-bold text-center text-blue-700 mb-6">
            Frequently Asked Questions
          </h4>
          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={faq.question}
                className="border border-blue-100 rounded-lg bg-white"
              >
                <button
                  className="w-full text-left px-5 py-3 focus:outline-none flex items-center justify-between"
                  onClick={() => setOpenFAQ(openFAQ === idx ? null : idx)}
                  aria-expanded={openFAQ === idx}
                >
                  <span className="font-semibold text-blue-700">
                    {faq.question}
                  </span>
                  <span
                    className={`ml-3 transition-transform ${
                      openFAQ === idx ? "rotate-180" : ""
                    }`}
                  >
                    ▼
                  </span>
                </button>
                {openFAQ === idx && (
                  <div className="px-5 pb-4 text-gray-700 animate-fade-in">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
