import { useState } from "react";
import CommentItem from "./CommentItem";
import ReportModal from "./ReportModal";
import toast from "react-hot-toast";
import AddCommentModal from "./AddCommentModal";
import ReplyModal from "./ReplyModal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosCommon from "../../hooks/useAxiosCommon";
import useAuth from "../../hooks/useAuth";
import LoadingSpinner from "../shared/LoadingSpinner";

export default function CommentSection({ post }) {
  const [showReport, setShowReport] = useState(false);
  const [reportCommentId, setReportCommentId] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newComment, setNewComment] = useState("");
  const queryClient = useQueryClient();
  const axiosCommon = useAxiosCommon();
  const { user } = useAuth();

  const { data: comments = [], isLoading: commentsLoading } = useQuery({
    queryKey: ["comments", post._id],
    queryFn: async () => {
      const { data } = await axiosCommon.get(`/posts/${post._id}/comments`);
      return data;
    },
  });

  const { mutateAsync: commentMutateAsync, isLoading: commentAdding } =
    useMutation({
      mutationFn: async (commentInfo) =>
        await axiosCommon.post(`/posts/${post._id}/comment`, commentInfo),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["comments", post._id] });
        queryClient.invalidateQueries({ queryKey: ["post", post._id] });
      },
      onError: () => {
        toast.error("Failed to comment on post. Please try again.");
      },
    });

  const handleAddComment = () => {
    setShowAddModal(true);
  };

  const handleSubmitComment = async () => {
    const commentInfo = {
      post_id: post._id,
      author: {
        id: user?.uid,
        name: user?.displayName,
        avatar: user?.photoURL,
      },
      comment: newComment,
      parent_id: null,
      reply_to: null,
      timestamp: Date.now(),
    };
    try {
      await commentMutateAsync(commentInfo);
      toast.success("Comment added successfully!");
      setShowAddModal(false);
      setNewComment("");
    } catch (err) {
      console.error("Error commenting on post: ", err.message);
      toast.error("Failed to comment on post. Please try again.");
    }
  };

  const handleReport = (commentId) => {
    setShowReport(true);
    setReportCommentId(commentId);
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

  const handleReplySubmit = async () => {
    if (!replyText.trim() || !replyingToComment) return;
    setReplying(true);
    const commentInfo = {
      post_id: post._id,
      author: {
        id: user?.uid,
        name: user?.displayName,
        avatar: user?.photoURL,
      },
      comment: replyText,
      parent_id: replyingToComment.id,
      reply_to: replyingToComment.author?.name,
      timestamp: Date.now(),
    };
    try {
      await commentMutateAsync(commentInfo);
      toast.success("Reply added successfully!");
      setShowReplyModal(false);
      setReplying(false);
    } catch (err) {
      console.error("Error replying to comment: ", err.message);
      toast.error("Failed to reply to comment. Please try again.");
    }
  };

  const { mutateAsync: reportMutateAsync, isLoading: reportLoading } =
    useMutation({
      mutationFn: async (reportInfo) =>
        await axiosCommon.post(
          `/comments/${reportInfo.commentId}/report`,
          reportInfo
        ),
      onSuccess: () => {
        toast.success("Comment reported successfully!");
        setShowReport(false);
      },
      onError: () => {
        toast.error("Failed to report comment. Please try again.");
      },
    });

  const handleReportSubmit = async (commentId, reason, details) => {
    const reportInfo = {
      commentId,
      reason,
      details,
    };
    if (!reason || !details) return;
    try {
      await reportMutateAsync(reportInfo);
    } catch (err) {
      console.error("Error reporting comment: ", err.message);
      toast.error("Failed to report comment. Please try again.");
    }
  };

  if (commentsLoading || commentAdding || reportLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-bold text-gray-800">Comments</h3>
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
            .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
            .map((comment) => (
              <CommentItem
                key={comment._id}
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
          setShowAddModal={setShowAddModal}
          adding={commentAdding}
          newComment={newComment}
          setNewComment={setNewComment}
          onSubmitComment={handleSubmitComment}
        />
      )}
      {showReport && (
        <ReportModal
          commentId={reportCommentId}
          onClose={() => setShowReport(false)}
          onSubmitReport={handleReportSubmit}
          loading={reportLoading}
        />
      )}
    </div>
  );
}
