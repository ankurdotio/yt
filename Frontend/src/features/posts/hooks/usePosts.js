import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import {
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
} from '../state/posts.slice';
import { getFeedApi, uploadImageApi, createPostApi } from '../service/posts.api';

/**
 * Hook Layer — connects state + service, exposes clean API to UI
 */
const usePosts = () => {
  const dispatch = useDispatch();
  const {
    posts,
    pagination,
    feedLoading,
    feedError,
    createLoading,
    createError,
    uploadLoading,
    uploadError,
    uploadedImageUrl,
  } = useSelector((state) => state.posts);

  /** Load fresh page 1 feed */
  const fetchFeed = useCallback(async () => {
    dispatch(fetchPostsStart());
    try {
      const response = await getFeedApi({ page: 1, limit: 10 });
      dispatch(fetchPostsSuccess(response.data));
    } catch (err) {
      dispatch(fetchPostsFailure(err?.response?.data?.message || err.message));
    }
  }, [dispatch]);

  /** Load next page (infinite scroll) */
  const loadMorePosts = useCallback(async () => {
    if (pagination.page >= pagination.pages) return;
    dispatch(fetchPostsStart());
    try {
      const response = await getFeedApi({ page: pagination.page + 1, limit: pagination.limit });
      dispatch(appendPosts(response.data));
    } catch (err) {
      dispatch(fetchPostsFailure(err?.response?.data?.message || err.message));
    }
  }, [dispatch, pagination]);

  /** Upload image file → stores URL in state */
  const uploadImage = useCallback(
    async (file) => {
      dispatch(uploadImageStart());
      try {
        const response = await uploadImageApi(file);
        dispatch(uploadImageSuccess(response.url));
        return response.url;
      } catch (err) {
        dispatch(uploadImageFailure(err?.response?.data?.message || err.message));
        return null;
      }
    },
    [dispatch]
  );

  /** Reset upload state (e.g. when user removes image) */
  const resetUpload = useCallback(() => dispatch(clearUpload()), [dispatch]);

  /** Submit new post */
  const createPost = useCallback(
    async ({ caption, imageUrl, imageType, imageAlt }) => {
      dispatch(createPostStart());
      try {
        const response = await createPostApi({
          media: [{ url: imageUrl, type: imageType, alt: imageAlt || caption || 'post image' }],
          caption,
        });
        dispatch(createPostSuccess(response.data));
        return true;
      } catch (err) {
        dispatch(createPostFailure(err?.response?.data?.message || err.message));
        return false;
      }
    },
    [dispatch]
  );

  const clearPostError = useCallback(() => dispatch(clearCreateError()), [dispatch]);

  return {
    // Feed
    posts,
    pagination,
    feedLoading,
    feedError,
    fetchFeed,
    loadMorePosts,
    // Image upload
    uploadLoading,
    uploadError,
    uploadedImageUrl,
    uploadImage,
    resetUpload,
    // Create post
    createLoading,
    createError,
    createPost,
    clearPostError,
  };
};

export default usePosts;
