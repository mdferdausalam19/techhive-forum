import { useState } from "react";
import toast from "react-hot-toast";

export default function ReportModal({ commentId, onClose }) {
  const [reason, setReason] = useState("Spam");
  const [details, setDetails] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      toast.success("Comment reported successfully!");
      setLoading(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-sm shadow-xl relative border-2 border-red-300">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-2xl"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        <div className="flex items-center mb-3">
          <span className="mr-2 text-red-500 text-xl">⚠️</span>
          <h3 className="text-lg font-bold text-red-600">Report Comment</h3>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Reason
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full border rounded px-2 py-1 focus:ring-2 focus:ring-red-200"
            >
              <option value="Spam">Spam</option>
              <option value="Abuse">Abuse</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Details
            </label>
            <textarea
              className="w-full border rounded px-2 py-1 focus:ring-2 focus:ring-red-200"
              rows={3}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600 disabled:opacity-50 shadow"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
