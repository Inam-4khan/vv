import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Signup } from '../../src/pages/Signup';

interface SignupPageProps {
  onSignup: () => void;
  onBack: () => void;
}

export const SignupPage: React.FC<SignupPageProps> = ({ onSignup, onBack }) => {
  const navigate = useNavigate();
  return (
    <Signup
      onSignup={onSignup}
      onBack={onBack}
      onSwitchToLogin={onBack}
      onNavigate={(path) => navigate(path === '/dashboard' ? '/home' : path === '/login' ? '/auth/login' : path)}
    />
  );
};

