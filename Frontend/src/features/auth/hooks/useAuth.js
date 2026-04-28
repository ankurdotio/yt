import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import { authStart, authSuccess, authFailure, clearError, logout } from '../state/auth.slice';
import { loginApi, signupApi } from '../service/auth.api';

/**
 * Hook Layer — connects state + service, exposes clean API to UI
 */
const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, loading, error } = useSelector((state) => state.auth);

  const login = useCallback(
    async (credentials) => {
      dispatch(authStart());
      try {
        const response = await loginApi(credentials);
        dispatch(authSuccess(response.data));
        navigate('/');
      } catch (err) {
        const message =
          err?.response?.data?.message || err.message || 'Login failed';
        dispatch(authFailure(message));
      }
    },
    [dispatch, navigate]
  );

  const register = useCallback(
    async (credentials) => {
      dispatch(authStart());
      try {
        const response = await signupApi(credentials);
        dispatch(authSuccess(response.data));
        navigate('/');
      } catch (err) {
        const message =
          err?.response?.data?.message || err.message || 'Registration failed';
        dispatch(authFailure(message));
      }
    },
    [dispatch, navigate]
  );

  const logoutUser = useCallback(() => {
    dispatch(logout());
    navigate('/login');
  }, [dispatch, navigate]);

  const clearAuthError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  return { user, loading, error, login, register, logout: logoutUser, clearAuthError };
};

export default useAuth;
