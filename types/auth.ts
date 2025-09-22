export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: 'passenger' | 'operator' | 'admin';
  preferences: {
    notifications: boolean;
    favoriteRoutes: string[];
    theme: 'light' | 'dark' | 'system';
  };
  createdAt: string;
  lastLogin: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface SignUpData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: 'passenger' | 'operator';
  agreeToTerms: boolean;
}