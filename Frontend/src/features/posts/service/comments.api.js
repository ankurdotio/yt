import axios from 'axios';

const commentsApi = axios.create({
  baseURL: '/api/comments',
  withCredentials: true,
});

/**
 * Service Layer — raw comment API calls
 */

/** Fetch all comments for a post */
export const getCommentsApi = async (postId) => {
  const { data } = await commentsApi.get(`/${postId}`);
  return data; // { success, data: { comments, total } }
};

/** Add a top-level comment or a reply */
export const addCommentApi = async ({ postid, text, parentComment = null }) => {

  const payload = {
    text: text
  }
  if (parentComment) {
    payload.parentComment = parentComment
  }

  const { data } = await commentsApi.post('/', { postid, ...payload });
  return data; // { success, data: comment }
};

/** Delete a comment (owner only) */
export const deleteCommentApi = async (commentId) => {
  const { data } = await commentsApi.delete(`/${commentId}`);
  return data;
};
