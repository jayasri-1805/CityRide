import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { User, AuthState, LoginCredentials, SignUpData } from '../types/auth';
import { toast } from 'sonner@2.0.3';

// Mock users database
const mockUsers: User[] = [
  {
    id: '1',
    email: 'user@demo.com',
    firstName: 'John',
    lastName: 'Passenger',
    phone: '+1234567890',
    role: 'passenger',
    preferences: {
      notifications: true,
      favoriteRoutes: ['Downtown Loop', 'University Route'],
      theme: 'system'
    },
    createdAt: '2024-01-01T00:00:00Z',
    lastLogin: new Date().toISOString()
  },
  {
    id: '2',
    email: 'operator@demo.com',
    firstName: 'Jane',
    lastName: 'Operator',
    phone: '+1234567891',
    role: 'operator',
    preferences: {
      notifications: true,
      favoriteRoutes: [],
      theme: 'light'
    },
    createdAt: '2024-01-01T00:00:00Z',
    lastLogin: new Date().toISOString()
  }
];

// Auth Context
const AuthContext = createContext<{
  auth: AuthState;
  login: (credentials: LoginCredentials) => Promise<void>;
  signUp: (data: SignUpData) => Promise<void>;
  logout: () => void;
  clearError: () => void;
} | null>(null);

// Auth Provider Component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    loading: true,
    error: null
  });

  // Check for existing auth on mount
  useEffect(() => {
    const checkExistingAuth = () => {
      try {
        const savedUser = localStorage.getItem('citytransit_user');
        const savedToken = localStorage.getItem('citytransit_token');
        
        if (savedUser && savedToken) {
          const user: User = JSON.parse(savedUser);
          setAuth({
            isAuthenticated: true,
            user,
            loading: false,
            error: null
          });
        } else {
          setAuth(prev => ({ ...prev, loading: false }));
        }
      } catch (error) {
        console.error('Error checking existing auth:', error);
        setAuth(prev => ({ ...prev, loading: false }));
      }
    };

    checkExistingAuth();
  }, []);

  const login = async (credentials: LoginCredentials): Promise<void> => {
    setAuth(prev => ({ ...prev, loading: true, error: null }));

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Find user in mock database
      const user = mockUsers.find(u => u.email === credentials.email);
      
      if (!user) {
        throw new Error('Invalid email or password');
      }

      // Simple password check (in real app, this would be hashed)
      if (credentials.password !== 'password123') {
        throw new Error('Invalid email or password');
      }

      // Update user's last login
      const updatedUser = {
        ...user,
        lastLogin: new Date().toISOString()
      };

      // Save to localStorage if remember me is checked
      if (credentials.rememberMe) {
        localStorage.setItem('citytransit_user', JSON.stringify(updatedUser));
        localStorage.setItem('citytransit_token', 'mock_jwt_token');
      }

      setAuth({
        isAuthenticated: true,
        user: updatedUser,
        loading: false,
        error: null
      });
    } catch (error) {
      setAuth(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Login failed'
      }));
      throw error;
    }
  };

  const signUp = async (data: SignUpData): Promise<void> => {
    setAuth(prev => ({ ...prev, loading: true, error: null }));

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Check if user already exists
      const existingUser = mockUsers.find(u => u.email === data.email);
      if (existingUser) {
        throw new Error('An account with this email already exists');
      }

      // Create new user
      const newUser: User = {
        id: (mockUsers.length + 1).toString(),
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        role: data.role,
        preferences: {
          notifications: true,
          favoriteRoutes: [],
          theme: 'system'
        },
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      };

      // Add to mock database
      mockUsers.push(newUser);

      // Auto-login after signup
      localStorage.setItem('citytransit_user', JSON.stringify(newUser));
      localStorage.setItem('citytransit_token', 'mock_jwt_token');

      setAuth({
        isAuthenticated: true,
        user: newUser,
        loading: false,
        error: null
      });
    } catch (error) {
      setAuth(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Sign up failed'
      }));
      throw error;
    }
  };

  const logout = () => {
    try {
      // Clear localStorage
      localStorage.removeItem('citytransit_user');
      localStorage.removeItem('citytransit_token');
      
      // Log logout event (in a real app, you might send this to analytics)
      console.log('User logged out:', auth.user?.email);
      
      // Update auth state
      setAuth({
        isAuthenticated: false,
        user: null,
        loading: false,
        error: null
      });

      // Show logout success message
      toast.success('Successfully signed out', {
        description: 'You have been logged out of your CityTransit account.'
      });
      
    } catch (error) {
      console.error('Error during logout:', error);
      // Even if there's an error, still log the user out
      setAuth({
        isAuthenticated: false,
        user: null,
        loading: false,
        error: null
      });
    }
  };

  const clearError = () => {
    setAuth(prev => ({ ...prev, error: null }));
  };

  return (
    <AuthContext.Provider value={{ auth, login, signUp, logout, clearError }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}