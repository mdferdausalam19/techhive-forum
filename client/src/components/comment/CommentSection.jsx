import { useState, useEffect } from "react";
import CommentItem from "./CommentItem";
import ReportModal from "./ReportModal";
import toast from "react-hot-toast";
import AddCommentModal from "./AddCommentModal";
import sampleComments from "../../data/sampleComments";
import ReplyModal from "./ReplyModal";

export default function CommentSection({ postId }) {
  const [comments, setComments] = useState([]);
  useEffect(() => {
    setComments(sampleComments.filter((c) => c.postId === postId));
  }, [postId]);
  const [showReport, setShowReport] = useState(false);
  const [reportCommentId, setReportCommentId] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [adding, setAdding] = useState(false);

  const handleReport = (commentId) => {
    setReportCommentId(commentId);
    setShowReport(true);
  };

  const handleAddComment = () => {
    setShowAddModal(true);
  };

  const handleSubmitComment = () => {
    if (!newComment.trim()) return;
    setAdding(true);
    setTimeout(() => {
      setComments((prev) => [
        {
          id: `c${Date.now()}`,
          postId,
          parentId: null,
          replyTo: null,
          author: {
            id: "u1",
            name: "Demo User",
            avatar: "https://i.pravatar.cc/48?img=1",
          },
          content: newComment,
          date: new Date().toLocaleString(),
        },
        ...prev,
      ]);
      setNewComment("");
      setShowAddModal(false);
      setAdding(false);
      toast.success("Comment added!");
    }, 600);
  };

  const [showReplyModal, setShowReplyModal] = useState(false);
  const [replyingToComment, setReplyingToComment] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [replying, setReplying] = useState(false);

  const handleReplyClick = (comment) => {
    setReplyingToComment(comment);
    setReplyText("");
    setShowReplyModal(true);
  };

  const handleReplySubmit = () => {
    if (!replyText.trim() || !replyingToComment) return;
    setReplying(true);
    setTimeout(() => {
      setComments((prev) => [
        {
          id: `r${Date.now()}`,
          postId,
          parentId: replyingToComment.id,
          replyTo: replyingToComment.author.name,
          author: {
            id: "u1",
            name: "Demo User",
            avatar: "https://i.pravatar.cc/48?img=1",
          },
          content: replyText,
          date: new Date().toLocaleString(),
        },
        ...prev,
      ]);
      setShowReplyModal(false);
      setReplying(false);
      toast.success("Reply added!");
    }, 600);
  };

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-bold text-gray-800">
          Comments
        </h3>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          onClick={handleAddComment}
        >
          Add Comment
        </button>
      </div>
      <div className="space-y-4">
        {comments.length === 0 ? (
          <div className="text-gray-500 text-center py-8">
            No comments yet. Be the first to comment!
          </div>
        ) : (
          comments
            .slice()
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                onReport={handleReport}
                onReply={() => handleReplyClick(comment)}
              />
            ))
        )}
      </div>
      <ReplyModal
        show={showReplyModal}
        onClose={() => setShowReplyModal(false)}
        replyingTo={replyingToComment ? replyingToComment.author.name : ""}
        replyText={replyText}
        setReplyText={setReplyText}
        onSubmit={handleReplySubmit}
        loading={replying}
      />
      {showAddModal && (
        <AddCommentModal
          postId={postId}
          setShowAddModal={setShowAddModal}
          adding={adding}
          newComment={newComment}
          setNewComment={setNewComment}
          handleSubmitComment={handleSubmitComment}
        />
      )}
      {showReport && (
        <ReportModal
          commentId={reportCommentId}
          onClose={() => setShowReport(false)}
        />
      )}
    </div>
  );
}
