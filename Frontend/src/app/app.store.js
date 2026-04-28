import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/state/auth.slice';
import postsReducer from '../features/posts/state/posts.slice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    posts: postsReducer
  }
});
