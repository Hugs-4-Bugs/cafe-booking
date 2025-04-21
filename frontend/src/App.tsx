import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Suspense, lazy, useEffect, useState } from 'react';
import { AuthProvider } from './contexts/AuthContext';

// Layouts
import AdminLayout from './components/layouts/AdminLayout';
import UserLayout from './components/layouts/UserLayout';
import AuthLayout from './components/layouts/AuthLayout';

// Lazy loaded pages
const Login = lazy(() => import('./pages/auth/Login'));
const Signup = lazy(() => import('./pages/auth/Signup'));
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'));

const Dashboard = lazy(() => import('./pages/dashboard/Dashboard'));
const Categories = lazy(() => import('./pages/dashboard/Categories'));
const Products = lazy(() => import('./pages/dashboard/Products'));
const Users = lazy(() => import('./pages/dashboard/Users'));
const Bills = lazy(() => import('./pages/dashboard/Bills'));

const Home = lazy(() => import('./pages/user/Home'));
const Menu = lazy(() => import('./pages/user/Menu'));
const Cart = lazy(() => import('./pages/user/Cart'));
const PaymentPage = lazy(() => import('./pages/user/Payment'));
const OrderConfirmation = lazy(() => import('./pages/user/OrderConfirmation'));
const OrderHistory = lazy(() => import('./pages/user/OrderHistory'));

// Loading component
const Loading = () => (
  <div className="h-screen w-full flex items-center justify-center">
    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-600"></div>
  </div>
);

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulating initial loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <AuthProvider>
      <Router>
        <Suspense fallback={<Loading />}>
          <Routes>
            {/* Auth routes */}
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
            </Route>

            {/* Admin routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="categories" element={<Categories />} />
              <Route path="products" element={<Products />} />
              <Route path="users" element={<Users />} />
              <Route path="bills" element={<Bills />} />
            </Route>

            {/* User routes */}
            <Route path="/" element={<UserLayout />}>
              <Route index element={<Home />} />
              <Route path="menu" element={<Menu />} />
              <Route path="cart" element={<Cart />} />
              <Route path="payment" element={<PaymentPage />} />
              <Route path="order-confirmation" element={<OrderConfirmation />} />
              <Route path="order-history" element={<OrderHistory />} />
            </Route>

            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
        <Toaster position="top-right" />
      </Router>
    </AuthProvider>
  );
}

export default App;
