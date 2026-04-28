import { useEffect, useRef, useCallback, useState } from 'react';
import { Link } from 'react-router';
import usePosts from '../hooks/usePosts';
import Sidebar from '../components/Sidebar';
import CommentDrawer from '../components/CommentDrawer';

/* ── helpers ── */
const timeAgo = (iso) => {
  const diff = (Date.now() - new Date(iso)) / 1000;
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return `${Math.floor(diff / 86400)}d`;
};

/* ── PostCard ── */
const PostCard = ({ post, onCommentClick }) => (
  <article className="pb-10 mb-10 border-b border-[#f0f0f0] last:border-none last:mb-0">
    {/* Header */}
    <div className="flex items-center gap-3 mb-4">
      {post.user?.avatar ? (
        <img
          src={post.user.avatar}
          alt={post.user.username}
          className="w-9 h-9 rounded-full object-cover bg-[#f0f0f0] flex-shrink-0"
        />
      ) : (
        <div className="w-9 h-9 rounded-full bg-[#111] flex items-center justify-center text-white text-xs font-medium flex-shrink-0">
          {post.user?.username?.[0]?.toUpperCase() ?? '?'}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-[#111] leading-none">{post.user?.username}</p>
        <p className="text-xs text-[#b0b0b0] mt-1">{timeAgo(post.createdAt)}</p>
      </div>
      {/* ••• menu placeholder */}
      <button className="text-[#b0b0b0] hover:text-[#111] transition-colors p-1">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="5" cy="12" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="19" cy="12" r="1.5" />
        </svg>
      </button>
    </div>

    {/* Media */}
    {post.media?.[0] && (
      <div className="w-full bg-[#f5f5f5] overflow-hidden mb-4" style={{ aspectRatio: '4/5' }}>
        <img
          src={post.media[0].url}
          alt={post.media[0].alt || post.caption || 'post'}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
    )}

    {/* Actions */}
    <div className="flex items-center gap-5 mb-3">
      <button className="flex items-center gap-1.5 text-[#737373] hover:text-[#111] transition-colors group">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:scale-110 transition-transform">
          <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
        </svg>
        <span className="text-xs">{post.likecount ?? 0}</span>
      </button>

      {/* Comment button — opens drawer */}
      <button
        onClick={() => onCommentClick(post._id)}
        className="flex items-center gap-1.5 text-[#737373] hover:text-[#111] transition-colors group"
        aria-label={`View ${post.commentcount ?? 0} comments`}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:scale-110 transition-transform">
          <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
        </svg>
        <span className="text-xs">{post.commentcount ?? 0}</span>
      </button>
    </div>

    {/* Caption */}
    {post.caption && (
      <p className="text-sm text-[#111] leading-relaxed line-clamp-3">
        <span className="font-semibold mr-1.5">{post.user?.username}</span>
        {post.caption}
      </p>
    )}
  </article>
);

/* ── Skeleton ── */
const PostSkeleton = () => (
  <div className="pb-10 mb-10 border-b border-[#f0f0f0] animate-pulse">
    <div className="flex items-center gap-3 mb-4">
      <div className="w-9 h-9 rounded-full bg-[#f0f0f0]" />
      <div className="flex-1">
        <div className="h-3 w-24 bg-[#f0f0f0] rounded mb-2" />
        <div className="h-2 w-12 bg-[#f0f0f0] rounded" />
      </div>
    </div>
    <div className="w-full bg-[#f5f5f5]" style={{ aspectRatio: '4/5' }} />
    <div className="flex gap-4 mt-4 mb-3">
      <div className="h-4 w-10 bg-[#f0f0f0] rounded" />
      <div className="h-4 w-10 bg-[#f0f0f0] rounded" />
    </div>
    <div className="h-3 w-3/4 bg-[#f0f0f0] rounded" />
  </div>
);

/* ── Empty state ── */
const EmptyFeed = () => (
  <div className="flex flex-col items-center justify-center py-24 text-center">
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#d0d0d0" strokeWidth="1" className="mb-6">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
    </svg>
    <p className="text-[#111] text-sm font-medium mb-1">Nothing here yet</p>
    <p className="text-[#737373] text-sm mb-6">Be the first to share something.</p>
    <Link
      to="/create"
      className="bg-[#111] text-white text-sm px-6 py-2.5 hover:bg-[#2a2a2a] transition-colors"
    >
      Create a post
    </Link>
  </div>
);

/* ── Home page ── */
const Home = () => {
  const { posts, feedLoading, feedError, pagination, fetchFeed, loadMorePosts } = usePosts();
  const [activeCommentPostId, setActiveCommentPostId] = useState(null);

  // Initial load
  useEffect(() => {
    fetchFeed();
  }, [fetchFeed]);

  // Infinite scroll sentinel
  const sentinelRef = useRef(null);
  const onIntersect = useCallback(
    (entries) => {
      if (entries[0].isIntersecting && !feedLoading && pagination.page < pagination.pages) {
        loadMorePosts();
      }
    },
    [feedLoading, loadMorePosts, pagination]
  );

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(onIntersect, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [onIntersect]);

  return (
    <div className="min-h-screen bg-white font-['Inter',sans-serif]">
      <Sidebar />

      {/* ── Mobile top bar ── */}
      <header className="lg:hidden fixed top-0 inset-x-0 z-10 flex items-center justify-between px-5 py-4 bg-white border-b border-[#f0f0f0]">
        <span className="text-[#111] text-base font-semibold tracking-tight">MINIMA</span>
        <Link to="/create" className="bg-[#111] text-white text-xs px-4 py-2">
          + New
        </Link>
      </header>

      {/* ── Main content ── */}
      <main className="lg:ml-60 flex justify-center px-5 pt-20 lg:pt-0 pb-20">
        <div className="w-full max-w-[600px] py-10">

          {/* Desktop create button */}
          <div className="hidden lg:flex justify-between items-center mb-10">
            <h1 className="text-xl font-semibold text-[#111] tracking-tight">Feed</h1>
            <Link
              to="/create"
              className="bg-[#111] text-white text-sm px-5 py-2.5 hover:bg-[#2a2a2a] transition-colors"
            >
              + New post
            </Link>
          </div>

          {/* Error */}
          {feedError && (
            <div className="mb-8 p-4 bg-[#fff5f5] border border-[#ffdad6]">
              <p className="text-[#ba1a1a] text-sm">{feedError}</p>
            </div>
          )}

          {/* Feed */}
          {feedLoading && posts.length === 0 ? (
            <>
              <PostSkeleton />
              <PostSkeleton />
              <PostSkeleton />
            </>
          ) : posts.length === 0 ? (
            <EmptyFeed />
          ) : (
            <>
              {posts.map((post) => (
                <PostCard
                  key={post._id}
                  post={post}
                  onCommentClick={(postId) => setActiveCommentPostId(postId)}
                />
              ))}

              {/* Load-more sentinel */}
              <div ref={sentinelRef} className="h-px" />

              {/* Loading more */}
              {feedLoading && (
                <div className="flex justify-center py-8">
                  <span className="w-5 h-5 border border-[#d0d0d0] border-t-[#111] rounded-full animate-spin" />
                </div>
              )}

              {/* End of feed */}
              {!feedLoading && pagination.page >= pagination.pages && posts.length > 0 && (
                <p className="text-center text-xs text-[#b0b0b0] py-8 tracking-widest uppercase">
                  You're all caught up
                </p>
              )}
            </>
          )}
        </div>
      </main>

      {/* ── Comment Drawer ── */}
      <CommentDrawer
        postId={activeCommentPostId}
        isOpen={!!activeCommentPostId}
        onClose={() => setActiveCommentPostId(null)}
      />
    </div>
  );
};

export default Home;