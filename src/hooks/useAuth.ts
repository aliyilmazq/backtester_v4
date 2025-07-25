import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { validateToken } from '../store/authSlice';
import authService from '../services/authService';

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const auth = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && !auth.isAuthenticated && !auth.loading) {
      dispatch(validateToken());
    }
  }, [dispatch, auth.isAuthenticated, auth.loading]);

  const checkPermission = (permission: string): boolean => {
    return authService.checkPermission(auth.user, permission);
  };

  const canManageStrategies = (): boolean => {
    return authService.canManageStrategies(auth.user);
  };

  const canExecuteTrades = (): boolean => {
    return authService.canExecuteTrades(auth.user);
  };

  const canViewReports = (): boolean => {
    return authService.canViewReports(auth.user);
  };

  return {
    ...auth,
    checkPermission,
    canManageStrategies,
    canExecuteTrades,
    canViewReports,
  };
};