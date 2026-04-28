import {
  loginStart,
  loginSuccess,
  loginFailure,
  logout
} from '../state/auth.slice';
import { useDispatch } from 'react-redux';
import {} from '../service/auth.api';
import { useCallback } from 'react';

const useAuth = () => {
  const dispatch = useDispatch();

  const login = useCallback(
    async credentials => {
      dispatch(loginStart());
      try {
        //
      } catch (error) {
        dispatch(loginFailure(error.message));
      }
    },
    [dispatch]
  );

  const logoutUser = useCallback(() => {
    dispatch(logout());
  }, [dispatch]);

  return { login, logout: logoutUser };
};
