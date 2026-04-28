import axios from 'axios';

const authApi = axios.create({
  baseURL: '/api/auth',
  withCredentials: true,
});

/**
 * Service Layer — raw API calls, no state logic
 */

export const loginApi = async ({ username, password }) => {
  const { data } = await authApi.post('/login', { username, password });
  return data;
};

export const signupApi = async ({ username, email, password }) => {
  const { data } = await authApi.post('/signup', { username, email, password });
  return data;
};
