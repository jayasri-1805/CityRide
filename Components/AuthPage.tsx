import { useState } from 'react';
import { LoginForm } from './LoginForm';
import { SignUpForm } from './SignUpForm';
import { useAuth } from '../hooks/useAuth';
import { LoginCredentials, SignUpData } from '../types/auth';

type AuthMode = 'login' | 'signup';

export function AuthPage() {
  const [mode, setMode] = useState<AuthMode>('login');
  const { auth, login, signUp, clearError } = useAuth();

  const handleLogin = async (credentials: LoginCredentials) => {
    clearError();
    await login(credentials);
  };

  const handleSignUp = async (data: SignUpData) => {
    clearError();
    await signUp(data);
  };

  const switchToSignUp = () => {
    clearError();
    setMode('signup');
  };

  const switchToLogin = () => {
    clearError();
    setMode('login');
  };

  if (mode === 'login') {
    return (
      <LoginForm
        onLogin={handleLogin}
        onSwitchToSignUp={switchToSignUp}
        loading={auth.loading}
        error={auth.error}
      />
    );
  }

  return (
    <SignUpForm
      onSignUp={handleSignUp}
      onSwitchToLogin={switchToLogin}
      loading={auth.loading}
      error={auth.error}
    />
  );
}