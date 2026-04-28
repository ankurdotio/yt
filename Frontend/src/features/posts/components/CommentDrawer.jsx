import { useEffect, useRef, useState } from 'react';
import useComments from '../hooks/useComments';

/* ── helpers ── */
const timeAgo = (iso) => {
  const diff = (Date.now() - new Date(iso)) / 1000;
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return `${Math.floor(diff / 86400)}d`;
};

const Avatar = ({ user, size = 8 }) => {
  const s = `w-${size} h-${size}`;
  return user?.avatar ? (
    <img
      src={user.avatar}
      alt={user.username}
      className={`${s} rounded-full object-cover bg-[#f0f0f0] flex-shrink-0`}
    />
  ) : (
    <div
      className={`${s} rounded-full bg-[#111] flex items-center justify-center text-white flex-shrink-0`}
      style={{ fontSize: size <= 6 ? '10px' : '12px' }}
    >
      {(user?.username ?? '?')[0].toUpperCase()}
    </div>
  );
};

/* ── AI badge ── */
const AIBadge = () => (
  <span className="inline-flex items-center gap-1 text-[10px] font-medium text-[#737373] bg-[#f5f5f5] px-1.5 py-0.5 ml-1.5">
    <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
    AI
  </span>
);

/* ── Single reply row ── */
const ReplyRow = ({ reply, postId, onDelete, currentUser }) => (
  <div className="flex gap-3 mt-3 pl-1">
    <Avatar user={reply.userid} size={6} />
    <div className="flex-1 min-w-0">
      <div className="flex items-baseline gap-2 flex-wrap">
        <span className="text-xs font-semibold text-[#111]">
          {reply.userid?.username}
          {reply.isAI && <AIBadge />}
        </span>
        <span className="text-[10px] text-[#b0b0b0]">{timeAgo(reply.createdAt)}</span>
      </div>
      <p className="text-xs text-[#333] mt-0.5 leading-relaxed">{reply.text}</p>
    </div>
    {currentUser?.username === reply.userid?.username && (
      <button
        onClick={() => onDelete(reply._id)}
        className="text-[#c0c0c0] hover:text-[#ba1a1a] transition-colors flex-shrink-0 mt-0.5"
        aria-label="Delete reply"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    )}
  </div>
);

/* ── Single comment row ── */
const CommentRow = ({ comment, postId, onDelete, onReply, currentUser }) => {
  const [showReplies, setShowReplies] = useState(true);
  const replyCount = comment.replies?.length ?? 0;

  return (
    <div className="py-4 border-b border-[#f8f8f8] last:border-none">
      <div className="flex gap-3">
        <Avatar user={comment.userid} size={8} />
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-sm font-semibold text-[#111]">
              {comment.userid?.username}
              {comment.isAI && <AIBadge />}
            </span>
            <span className="text-xs text-[#b0b0b0]">{timeAgo(comment.createdAt)}</span>
          </div>
          <p className="text-sm text-[#333] mt-1 leading-relaxed">{comment.text}</p>
          <button
            onClick={() => onReply(comment)}
            className="text-xs text-[#737373] hover:text-[#111] transition-colors mt-1.5"
          >
            Reply
          </button>
        </div>
        {currentUser?.username === comment.userid?.username && (
          <button
            onClick={() => onDelete(comment._id)}
            className="text-[#c0c0c0] hover:text-[#ba1a1a] transition-colors flex-shrink-0 mt-0.5"
            aria-label="Delete comment"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>

      {/* Replies */}
      {replyCount > 0 && (
        <div className="ml-11">
          <button
            onClick={() => setShowReplies((s) => !s)}
            className="text-xs text-[#737373] hover:text-[#111] transition-colors mt-2 flex items-center gap-1"
          >
            <svg
              width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
              className={`transition-transform duration-200 ${showReplies ? 'rotate-90' : ''}`}
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
            {showReplies ? 'Hide' : 'View'} {replyCount} {replyCount === 1 ? 'reply' : 'replies'}
          </button>

          {showReplies && comment.replies.map((reply) => (
            <ReplyRow
              key={reply._id}
              reply={reply}
              postId={postId}
              onDelete={onDelete}
              currentUser={currentUser}
            />
          ))}
        </div>
      )}
    </div>
  );
};

/* ── Skeleton ── */
const CommentSkeleton = () => (
  <div className="py-4 border-b border-[#f8f8f8] flex gap-3 animate-pulse">
    <div className="w-8 h-8 rounded-full bg-[#f0f0f0] flex-shrink-0" />
    <div className="flex-1">
      <div className="h-3 w-24 bg-[#f0f0f0] rounded mb-2" />
      <div className="h-3 w-3/4 bg-[#f0f0f0] rounded" />
    </div>
  </div>
);

/* ── Comment Drawer ── */
/**
 * props:
 *   postId  — string
 *   isOpen  — bool
 *   onClose — fn
 */
const CommentDrawer = ({ postId, isOpen, onClose }) => {
  const {
    comments,
    total,
    loading,
    addLoading,
    error,
    currentUser,
    fetchComments,
    addComment,
    deleteComment,
  } = useComments(postId);

  const [text, setText] = useState('');
  const [replyingTo, setReplyingTo] = useState(null); // { _id, userid.username }
  const inputRef = useRef(null);
  const scrollRef = useRef(null);

  // Fetch when opened (once per postId)
  useEffect(() => {
    if (isOpen && postId) fetchComments();
  }, [isOpen, postId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Focus input when replying
  useEffect(() => {
    if (replyingTo) inputRef.current?.focus();
  }, [replyingTo]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;

    const ok = await addComment({
      text: trimmed,
      parentComment: replyingTo?._id ?? null,
    });

    if (ok) {
      setText('');
      setReplyingTo(null);
      // Scroll list to top to show new comment
      scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleReply = (comment) => {
    setReplyingTo(comment);
    setText(`@${comment.userid?.username} `);
    inputRef.current?.focus();
  };

  const cancelReply = () => {
    setReplyingTo(null);
    setText('');
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/30 z-30 transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Comments"
        className={`fixed bottom-0 left-0 right-0 z-40 bg-white
          flex flex-col
          transition-transform duration-300 ease-out
          ${isOpen ? 'translate-y-0' : 'translate-y-full'}
          sm:bottom-auto sm:top-0 sm:right-0 sm:left-auto
          sm:h-screen sm:w-[420px]
          sm:translate-y-0
          ${isOpen ? 'sm:translate-x-0' : 'sm:translate-x-full'}
          rounded-t-2xl sm:rounded-none
          max-h-[85vh] sm:max-h-none
          font-['Inter',sans-serif]
        `}
        style={{
          transition: 'transform 300ms cubic-bezier(0.32,0,0.67,0)',
        }}
      >
        {/* Handle bar (mobile) */}
        <div className="sm:hidden flex justify-center pt-3 pb-1 flex-shrink-0">
          <div className="w-10 h-1 bg-[#e0e0e0] rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#f0f0f0] flex-shrink-0">
          <h2 className="text-base font-semibold text-[#111]">
            Comments
            {total > 0 && (
              <span className="ml-2 text-xs font-normal text-[#737373]">{total}</span>
            )}
          </h2>
          <button
            onClick={onClose}
            className="text-[#737373] hover:text-[#111] transition-colors p-1"
            aria-label="Close comments"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Comment list */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 overscroll-contain">
          {loading ? (
            <>
              <CommentSkeleton />
              <CommentSkeleton />
              <CommentSkeleton />
            </>
          ) : error ? (
            <div className="py-10 text-center">
              <p className="text-[#ba1a1a] text-sm">{error}</p>
              <button
                onClick={fetchComments}
                className="mt-3 text-xs text-[#737373] underline underline-offset-4"
              >
                Try again
              </button>
            </div>
          ) : comments.length === 0 ? (
            <div className="py-16 flex flex-col items-center justify-center text-center">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#d0d0d0" strokeWidth="1" className="mb-4">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
              </svg>
              <p className="text-[#111] text-sm font-medium mb-1">No comments yet</p>
              <p className="text-[#737373] text-xs">Be the first to say something.</p>
            </div>
          ) : (
            comments.map((comment) => (
              <CommentRow
                key={comment._id}
                comment={comment}
                postId={postId}
                onDelete={deleteComment}
                onReply={handleReply}
                currentUser={currentUser}
              />
            ))
          )}
        </div>

        {/* Reply context strip */}
        {replyingTo && (
          <div className="flex items-center justify-between gap-2 px-5 py-2.5 bg-[#fafafa] border-t border-[#f0f0f0] flex-shrink-0">
            <p className="text-xs text-[#737373]">
              Replying to{' '}
              <span className="font-semibold text-[#111]">@{replyingTo.userid?.username}</span>
            </p>
            <button
              onClick={cancelReply}
              className="text-[#737373] hover:text-[#111] transition-colors"
              aria-label="Cancel reply"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        )}

        {/* Input bar */}
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-3 px-5 py-4 border-t border-[#f0f0f0] flex-shrink-0 bg-white"
        >
          {currentUser && <Avatar user={currentUser} size={8} />}
          <input
            ref={inputRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={replyingTo ? `Reply to @${replyingTo.userid?.username}…` : 'Add a comment…'}
            maxLength={1000}
            className="flex-1 bg-[#f5f5f5] text-sm text-[#111] placeholder-[#c0c0c0] px-4 py-2.5 outline-none border-b-2 border-transparent focus:border-[#111] transition-colors duration-200 min-w-0"
          />
          <button
            type="submit"
            disabled={!text.trim() || addLoading}
            className="bg-[#111] text-white text-xs font-medium px-4 py-2.5 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#2a2a2a] transition-colors flex-shrink-0"
            aria-label="Post comment"
          >
            {addLoading ? (
              <span className="w-3.5 h-3.5 border border-white/40 border-t-white rounded-full animate-spin block" />
            ) : (
              'Post'
            )}
          </button>
        </form>
      </div>
    </>
  );
};

export default CommentDrawer;
