import { MdOutlineReport } from "react-icons/md";
import { IoWarningOutline } from "react-icons/io5";

export default function CommentItem({ comment, onReport, onReply }) {
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };
  return (
    <div
      className={`relative rounded-lg p-5 mb-2 shadow-sm border border-blue-100 hover:shadow-lg transition-all duration-200 ${
        comment.reply_to_author
          ? "bg-blue-50 border-l-4 border-blue-300"
          : "bg-white border-l-4 border-blue-100"
      }`}
    >
      <div className="flex items-center justify-between gap-4 mb-2">
        <div className="flex items-center gap-2">
          <img
            src={
              comment.author?.avatar ||
              "https://i.ibb.co/9H2PJ7h2/d43801412989.jpg"
            }
            alt="avatar"
            className="w-10 h-10 rounded-full border-2 border-blue-200 shadow-sm"
          />
          <div className="flex flex-col">
            <span className="font-semibold text-blue-700 text-base">
              {comment.author?.name}
            </span>
            <span className="text-xs text-gray-400 mt-0.5">
              {formatTimestamp(comment.timestamp)}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {comment.report && (
            <MdOutlineReport className="text-red-500 text-2xl" />
          )}
          {comment.warning && (
            <IoWarningOutline className="text-yellow-500 text-2xl" />
          )}
        </div>
      </div>
      {comment.reply_to_author && (
        <div className="text-xs text-blue-600 mb-1">
          Reply to {comment.reply_to_author.name}
        </div>
      )}
      <p className="text-gray-700 mb-2">{comment.comment}</p>
      <div className="flex gap-2 text-xs">
        <button className="text-blue-500 hover:underline" onClick={onReply}>
          Reply
        </button>
        <button
          className="text-gray-500 hover:underline hover:text-red-500"
          onClick={() => onReport(comment._id)}
        >
          Report
        </button>
      </div>
    </div>
  );
}
