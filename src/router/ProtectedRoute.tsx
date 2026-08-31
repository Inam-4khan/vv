import React from 'react';
import { Navigate, Outlet, useOutletContext } from 'react-router-dom';
import { useAppState } from '../context/AppStateContext';
import { useAuth } from '../context/AuthContext';
import { AppOutletContext } from '../../App';

interface ProtectedRouteProps {
  children?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user } = useAppState();
  const auth = useAuth();
  const outletContext = useOutletContext<AppOutletContext>();

  const isUserAuthenticated = Boolean(user || auth?.user || auth?.isAuthenticated);

  if (!isUserAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  return children ? <>{children}</> : <Outlet context={outletContext} />;
};
