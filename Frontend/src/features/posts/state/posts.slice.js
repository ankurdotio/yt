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
      state.uploadedImageUrl = action.payload; // URL string
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
      // Prepend to feed
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
} = postsSlice.actions;

export default postsSlice.reducer;
