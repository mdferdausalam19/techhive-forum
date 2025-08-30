import { FiAlertTriangle, FiX, FiSend } from "react-icons/fi";

export default function WarningModal({
  isOpen,
  onClose,
  user,
  onSendWarning,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center">
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center">
                <FiAlertTriangle className="h-5 w-5 text-yellow-600" />
              </div>
              <h3 className="ml-3 text-xl font-medium text-gray-900">
                Send Warning
              </h3>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <FiX className="h-6 w-6" />
            </button>
          </div>

          <div className="mt-4 space-y-4">
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <FiAlertTriangle className="h-5 w-5 text-yellow-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    You are about to send a warning to{" "}
                    <span className="font-medium">{user?.name}</span> regarding
                    their comment.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onSendWarning}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50 bg-yellow-500 text-white"
              >
                <div className="flex items-center gap-2">
                  <FiSend className="h-4 w-4" />
                  Send Warning
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
