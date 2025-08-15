import { useState } from "react";

const faqItems = [
  {
    question: "How do I create an account?",
    answer:
      'Click on the "Sign Up" button in the top right corner and follow the simple registration process. You\'ll need to provide a valid email address and create a password.',
  },
  {
    question: "Is TechHive free to use?",
    answer:
      "Yes, TechHive is completely free to use! You can browse discussions, ask questions, and participate in the community without any cost.",
  },
  {
    question: "What payment methods are supported?",
    answer:
      "You can pay using any major credit/debit card or securely via Stripe. Your Premium access is activated instantly.",
  },
  {
    question: "Can I cancel anytime?",
    answer:
      "No, you can't cancel your subscription because it's a one-time purchase.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Frequently Asked Questions
        </h2>
        <p className="text-lg text-gray-600">
          Find quick answers to common questions about TechHive
        </p>
      </div>

      <div className="space-y-4">
        {faqItems.map((item, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-lg overflow-hidden"
          >
            <button
              className={`flex justify-between items-center w-full px-6 py-4 text-left focus:outline-none ${
                openIndex === index ? "bg-indigo-50" : "hover:bg-gray-50"
              } border border-indigo-200`}
              onClick={() => toggleFAQ(index)}
            >
              <span className="text-lg font-medium text-gray-900">
                {item.question}
              </span>
              <svg
                className={`w-5 h-5 text-indigo-600 transition-transform duration-200 ${
                  openIndex === index ? "transform rotate-180" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            <div
              className={`px-6 overflow-hidden transition-all duration-300 ${
                openIndex === index ? "max-h-48 p-6" : "max-h-0"
              }`}
            >
              <p className="text-gray-600">{item.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
