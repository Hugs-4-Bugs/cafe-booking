import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

type User = {
  id: number;
  name: string;
  email: string;
  contactNumber: string;
  status: string;
  role: string;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, contactNumber: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<void>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is authenticated on mount
  useEffect(() => {
    const validateToken = async () => {
      if (token) {
        try {
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          const response = await axios.get('/user/checkToken');

          if (response.status === 200) {
            // Token is valid, fetch user data
            fetchUserData();
          } else {
            // Token is invalid
            handleLogout();
          }
        } catch (error) {
          // Token validation failed
          handleLogout();
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    validateToken();
  }, [token]);

  const fetchUserData = async () => {
    try {
      // This is a placeholder. We would need to implement an endpoint to get user data
      // For now, we'll decode the username from the token and use that
      const tokenParts = token?.split('.');
      if (tokenParts && tokenParts.length === 3) {
        const payload = JSON.parse(atob(tokenParts[1]));
        const email = payload.sub; // JWT typically uses 'sub' for subject (username/email)

        // Set minimal user data based on token
        setUser({
          id: payload.id || 0,
          name: payload.name || 'User',
          email: email,
          contactNumber: payload.contactNumber || '',
          status: 'true',
          role: payload.role || 'user'
        });
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast.error('Failed to load user data');
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await axios.post('/user/login', { email, password });

      if (response.data) {
        const data = response.data;

        // Extract token from response
        // This assumes the backend returns a token in the response
        // We'll need to adjust based on actual response format
        const tokenValue = data.token || data;

        localStorage.setItem('token', tokenValue);
        setToken(tokenValue);

        // Set axios default header for future requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${tokenValue}`;

        toast.success('Logged in successfully');

        // Fetch user data
        fetchUserData();
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed. Please check your credentials.');
      setToken(null);
      localStorage.removeItem('token');
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, contactNumber: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await axios.post('/user/signup', {
        name,
        contactNumber,
        email,
        password
      });

      toast.success('Account created successfully. Please login.');
      return response.data;
    } catch (error) {
      console.error('Signup error:', error);
      toast.error('Signup failed. Please try again.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  const logout = () => {
    handleLogout();
    toast.success('Logged out successfully');
  };

  const forgotPassword = async (email: string) => {
    setIsLoading(true);
    try {
      const response = await axios.post('/user/forgotPassword', { email });
      toast.success('Password reset instructions sent to your email');
      return response.data;
    } catch (error) {
      console.error('Forgot password error:', error);
      toast.error('Failed to process password reset');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const changePassword = async (oldPassword: string, newPassword: string) => {
    setIsLoading(true);
    try {
      const response = await axios.post('/user/changePassword', {
        oldPassword,
        newPassword
      });

      toast.success('Password changed successfully');
      return response.data;
    } catch (error) {
      console.error('Change password error:', error);
      toast.error('Failed to change password');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    token,
    isLoading,
    isAuthenticated: !!user,
    login,
    signup,
    logout,
    forgotPassword,
    changePassword
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
