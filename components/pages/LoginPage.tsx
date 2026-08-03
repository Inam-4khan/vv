import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Login } from '../../src/pages/Login';

interface LoginPageProps {
  onLogin: () => void;
  onBack: () => void;
  onSignUp: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onBack, onSignUp }) => {
  const navigate = useNavigate();
  return (
    <Login
      onLogin={onLogin}
      onSignUp={onSignUp}
      onSwitchToSignup={onSignUp}
      onBack={onBack}
      onNavigate={(path) => navigate(path === '/dashboard' ? '/home' : path)}
    />
  );
};
