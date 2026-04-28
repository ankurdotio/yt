import axios from 'axios';

const postsApi = axios.create({
  baseURL: '/api/posts',
  withCredentials: true,
});

/**
 * Service Layer — raw API calls, no state logic
 */

/** Upload a single image file; returns { url } */
export const uploadImageApi = async (file) => {
  const formData = new FormData();
  formData.append('image', file);
  const { data } = await postsApi.post('/upload-image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data; // { success, url, message }
};

/** Create a new post */
export const createPostApi = async ({ media, caption }) => {
  const { data } = await postsApi.post('/', { media, caption });
  return data; // { success, message, data: post }
};

/** Fetch paginated feed */
export const getFeedApi = async ({ page = 1, limit = 10 } = {}) => {
  const { data } = await postsApi.get('/', { params: { page, limit } });
  return data; // { success, message, data: { posts, pagination } }
};
