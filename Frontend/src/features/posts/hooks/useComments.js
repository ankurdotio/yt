import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import {
  fetchCommentsStart,
  fetchCommentsSuccess,
  fetchCommentsFailure,
  addCommentStart,
  addCommentSuccess,
  addCommentFailure,
  deleteCommentSuccess,
} from '../state/posts.slice';
import { getCommentsApi, addCommentApi, deleteCommentApi } from '../service/comments.api';

/**
 * Hook Layer — comments for a specific post
 */
const useComments = (postId) => {
  const dispatch = useDispatch();
  const bucket = useSelector((state) => state.posts.commentsByPost[postId]);
  const currentUser = useSelector((state) => state.auth.user);

  const comments = bucket?.comments ?? [];
  const total = bucket?.total ?? 0;
  const loading = bucket?.loading ?? false;
  const addLoading = bucket?.addLoading ?? false;
  const error = bucket?.error ?? null;

  /** Load (or refresh) comments for this post */
  const fetchComments = useCallback(async () => {
    dispatch(fetchCommentsStart(postId));
    try {
      const response = await getCommentsApi(postId);
      dispatch(
        fetchCommentsSuccess({
          postId,
          comments: response.data.comments,
          total: response.data.total,
        })
      );
    } catch (err) {
      dispatch(
        fetchCommentsFailure({
          postId,
          error: err?.response?.data?.message || err.message,
        })
      );
    }
  }, [dispatch, postId]);

  /** Add a top-level comment or a reply */
  const addComment = useCallback(
    async ({ text, parentComment = null }) => {
      dispatch(addCommentStart(postId));
      try {
        const response = await addCommentApi({ postid: postId, text, parentComment });
        dispatch(addCommentSuccess({ postId, comment: response.data }));
        return true;
      } catch (err) {
        dispatch(
          addCommentFailure({
            postId,
            error: err?.response?.data?.message || err.message,
          })
        );
        return false;
      }
    },
    [dispatch, postId]
  );

  /** Delete a comment (owner only) */
  const deleteComment = useCallback(
    async (commentId) => {
      try {
        await deleteCommentApi(commentId);
        dispatch(deleteCommentSuccess({ postId, commentId }));
      } catch {
        // silently fail — UI doesn't revert optimistically here
      }
    },
    [dispatch, postId]
  );

  return {
    comments,
    total,
    loading,
    addLoading,
    error,
    currentUser,
    fetchComments,
    addComment,
    deleteComment,
  };
};

export default useComments;
