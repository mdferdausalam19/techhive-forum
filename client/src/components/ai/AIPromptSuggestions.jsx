const suggestions = [
  {
    category: "Generate Post",
    prompts: [
      "Generate a post about React hooks best practices",
      "Create a discussion about JavaScript ES6 features",
      "Write a post comparing frontend frameworks",
    ],
  },
  {
    category: "Tech Help",
    prompts: [
      "How do I optimize React performance?",
      "What are the best practices for API design?",
      "Explain the difference between SQL and NoSQL",
    ],
  },
  {
    category: "Ideas",
    prompts: [
      "Give me project ideas for a beginner developer",
      "What are trending technologies in 2024?",
      "Suggest topics for a tech blog",
    ],
  },
];

export default function AIPromptSuggestions({ onSuggestionClick }) {
  return (
    <div className="bg-white rounded-lg shadow-lg border border-blue-100 p-4">
      <h3 className="text-lg font-semibold text-blue-700 mb-3">Quick Suggestions</h3>
      
      <div className="space-y-4">
        {suggestions.map((category) => (
          <div key={category.category}>
            <h4 className="text-sm font-medium text-gray-600 mb-2">{category.category}</h4>
            <div className="flex flex-wrap gap-2">
              {category.prompts.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => onSuggestionClick(prompt)}
                  className="px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs rounded-full border border-blue-200 transition"
                >
                  {prompt.length > 40 ? `${prompt.substring(0, 40)}...` : prompt}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 pt-3 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          💡 Click any suggestion to add it to your message
        </p>
      </div>
    </div>
  );
}
