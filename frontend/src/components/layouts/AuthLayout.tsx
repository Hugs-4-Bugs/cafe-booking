import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const AuthLayout = () => {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // If user is already authenticated, redirect based on role
  if (isAuthenticated && user) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/'} replace />;
  }

  return (
    <div className="bg-gradient-to-br from-primary-50 to-accent-50 min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary-900">Café Management System</h1>
          <p className="text-secondary-600 mt-2">Welcome to your café management platform</p>
        </div>
        <div className="bg-white shadow-xl rounded-xl overflow-hidden">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
