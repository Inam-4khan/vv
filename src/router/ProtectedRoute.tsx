import React from 'react';
import { Navigate, Outlet, useOutletContext } from 'react-router-dom';
import { useAppState } from '../context/AppStateContext';

interface ProtectedRouteProps {
  children?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user } = useAppState();
  const outletContext = useOutletContext();

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  return children ? <>{children}</> : <Outlet context={outletContext} />;
};
