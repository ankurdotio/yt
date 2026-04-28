import { createSlice } from '@reduxjs/toolkit';

const postsSlice = createSlice({
  name: 'posts',
  initialState: {
    // Feed
    posts: [],
    pagination: { total: 0, page: 1, limit: 10, pages: 1 },
    feedLoading: false,
    feedError: null,
    // Create post
    createLoading: false,
    createError: null,
    // Image upload
    uploadLoading: false,
    uploadError: null,
    uploadedImageUrl: null,
    // Comments — keyed by postId
    commentsByPost: {}, // { [postId]: { comments: [], total: 0, loading: bool, error: str|null, addLoading: bool } }
  },
  reducers: {
    // ── Feed ──
    fetchPostsStart(state) {
      state.feedLoading = true;
      state.feedError = null;
    },
    fetchPostsSuccess(state, action) {
      state.feedLoading = false;
      state.posts = action.payload.posts;
      state.pagination = action.payload.pagination;
    },
    fetchPostsFailure(state, action) {
      state.feedLoading = false;
      state.feedError = action.payload;
    },
    appendPosts(state, action) {
      state.posts = [...state.posts, ...action.payload.posts];
      state.pagination = action.payload.pagination;
      state.feedLoading = false;
    },

    // ── Image upload ──
    uploadImageStart(state) {
      state.uploadLoading = true;
      state.uploadError = null;
      state.uploadedImageUrl = null;
    },
    uploadImageSuccess(state, action) {
      state.uploadLoading = false;
      state.uploadedImageUrl = action.payload;
    },
    uploadImageFailure(state, action) {
      state.uploadLoading = false;
      state.uploadError = action.payload;
    },
    clearUpload(state) {
      state.uploadLoading = false;
      state.uploadError = null;
      state.uploadedImageUrl = null;
    },

    // ── Create post ──
    createPostStart(state) {
      state.createLoading = true;
      state.createError = null;
    },
    createPostSuccess(state, action) {
      state.createLoading = false;
      state.posts = [action.payload, ...state.posts];
      state.uploadedImageUrl = null;
    },
    createPostFailure(state, action) {
      state.createLoading = false;
      state.createError = action.payload;
    },
    clearCreateError(state) {
      state.createError = null;
    },

    // ── Comments ──
    fetchCommentsStart(state, action) {
      const pid = action.payload;
      state.commentsByPost[pid] = {
        ...(state.commentsByPost[pid] ?? {}),
        loading: true,
        error: null,
      };
    },
    fetchCommentsSuccess(state, action) {
      const { postId, comments, total } = action.payload;
      state.commentsByPost[postId] = {
        comments,
        total,
        loading: false,
        error: null,
        addLoading: false,
      };
      // Sync comment count on the post card
      const post = state.posts.find((p) => p._id === postId);
      if (post) post.commentcount = total;
    },
    fetchCommentsFailure(state, action) {
      const { postId, error } = action.payload;
      if (state.commentsByPost[postId]) {
        state.commentsByPost[postId].loading = false;
        state.commentsByPost[postId].error = error;
      }
    },

    addCommentStart(state, action) {
      const pid = action.payload;
      if (state.commentsByPost[pid]) state.commentsByPost[pid].addLoading = true;
    },
    addCommentSuccess(state, action) {
      const { postId, comment } = action.payload;
      const bucket = state.commentsByPost[postId];
      if (!bucket) return;
      bucket.addLoading = false;
      if (comment.parentComment) {
        // It's a reply — nest under parent
        const parent = bucket.comments.find((c) => c._id === comment.parentComment);
        if (parent) {
          parent.replies = [...(parent.replies ?? []), comment];
        }
      } else {
        bucket.comments = [comment, ...bucket.comments];
        bucket.total = (bucket.total ?? 0) + 1;
      }
      // Increment count on the post card
      const post = state.posts.find((p) => p._id === postId);
      if (post && !comment.parentComment) post.commentcount = (post.commentcount ?? 0) + 1;
    },
    addCommentFailure(state, action) {
      const { postId, error } = action.payload;
      if (state.commentsByPost[postId]) {
        state.commentsByPost[postId].addLoading = false;
        state.commentsByPost[postId].error = error;
      }
    },

    deleteCommentSuccess(state, action) {
      const { postId, commentId } = action.payload;
      const bucket = state.commentsByPost[postId];
      if (!bucket) return;
      // Remove top-level
      const before = bucket.comments.length;
      bucket.comments = bucket.comments.filter((c) => c._id !== commentId);
      // Remove as reply
      bucket.comments.forEach((c) => {
        if (c.replies?.length) {
          c.replies = c.replies.filter((r) => r._id !== commentId);
        }
      });
      if (bucket.comments.length < before) {
        bucket.total = Math.max(0, (bucket.total ?? 1) - 1);
        const post = state.posts.find((p) => p._id === postId);
        if (post) post.commentcount = Math.max(0, (post.commentcount ?? 1) - 1);
      }
    },
  },
});

export const {
  fetchPostsStart,
  fetchPostsSuccess,
  fetchPostsFailure,
  appendPosts,
  uploadImageStart,
  uploadImageSuccess,
  uploadImageFailure,
  clearUpload,
  createPostStart,
  createPostSuccess,
  createPostFailure,
  clearCreateError,
  fetchCommentsStart,
  fetchCommentsSuccess,
  fetchCommentsFailure,
  addCommentStart,
  addCommentSuccess,
  addCommentFailure,
  deleteCommentSuccess,
} = postsSlice.actions;

export default postsSlice.reducer;
