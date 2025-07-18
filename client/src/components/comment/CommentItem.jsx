export default function CommentItem({ comment, onReport, onReply }) {
  return (
    <div className={`relative rounded-lg p-5 mb-2 shadow-sm border border-blue-100 hover:shadow-lg transition-all duration-200 ${comment.replyTo ? 'bg-blue-50 border-l-4 border-blue-300' : 'bg-white border-l-4 border-blue-100'}`}>
      <div className="flex items-center gap-4 mb-2">
        <img
          src={comment.author.avatar}
          alt="avatar"
          className="w-10 h-10 rounded-full border-2 border-blue-200 shadow-sm"
        />
        <div className="flex flex-col">
          <span className="font-semibold text-blue-700 text-base">
            {comment.author.name}
          </span>
          <span className="text-xs text-gray-400 mt-0.5">{comment.date}</span>
        </div>
      </div>
      {comment.replyTo && (
        <div className="text-xs text-blue-600 mb-1">Reply to {comment.replyTo}</div>
      )}
      <p className="text-gray-700 mb-2">{comment.content}</p>
      <div className="flex gap-2 text-xs">
        <button
          className="text-blue-500 hover:underline"
          onClick={onReply}
        >
          Reply
        </button>
        <button
          className="text-gray-500 hover:underline hover:text-red-500"
          onClick={() => onReport(comment.id)}
        >
          Report
        </button>
      </div>
    </div>
  );
}

