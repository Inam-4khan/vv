import React from 'react';
import { Signup } from '../../src/pages/Signup';

interface SignupPageProps {
  onSignup: () => void;
  onBack: () => void;
}

export const SignupPage: React.FC<SignupPageProps> = ({ onSignup, onBack }) => {
  return (
    <Signup
      onSignup={onSignup}
      onBack={onBack}
      onSwitchToLogin={onBack}
    />
  );
};
