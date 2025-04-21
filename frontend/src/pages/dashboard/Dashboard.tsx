import { useState, useEffect } from 'react';
import { dashboardService } from '../../services';
import { IDashboardCount } from '../../services/dashboardService';
import { Link } from 'react-router-dom';
import {
  UsersIcon,
  ClipboardDocumentListIcon,
  SquaresPlusIcon,
  ShoppingBagIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from '@heroicons/react/24/outline';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const Dashboard = () => {
  const [stats, setStats] = useState<IDashboardCount | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await dashboardService.getCount();
      setStats(response.data);
      setError('');
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data. Please try refreshing the page.');
    } finally {
      setLoading(false);
    }
  };

  // Mock data for charts
  const salesData = [
    { name: 'Monday', sales: 2400 },
    { name: 'Tuesday', sales: 1398 },
    { name: 'Wednesday', sales: 9800 },
    { name: 'Thursday', sales: 3908 },
    { name: 'Friday', sales: 4800 },
    { name: 'Saturday', sales: 3800 },
    { name: 'Sunday', sales: 4300 },
  ];

  const categoryData = [
    { name: 'Beverages', value: 400 },
    { name: 'Breakfast', value: 300 },
    { name: 'Lunch', value: 300 },
    { name: 'Dinner', value: 200 },
    { name: 'Desserts', value: 100 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  const StatCard = ({ title, value, icon, color, change }: {
    title: string;
    value: number | string;
    icon: React.ReactNode;
    color: string;
    change?: { value: number; type: 'increase' | 'decrease' };
  }) => (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden border-l-4 ${color}`}>
      <div className="p-5">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>

            {change && (
              <div className={`mt-1 flex items-center text-sm ${
                change.type === 'increase' ? 'text-green-600' : 'text-red-600'
              }`}>
                {change.type === 'increase' ? (
                  <ArrowUpIcon className="h-4 w-4 mr-1" />
                ) : (
                  <ArrowDownIcon className="h-4 w-4 mr-1" />
                )}
                <span>{change.value}% from last month</span>
              </div>
            )}
          </div>
          <div className={`p-3 rounded-full ${color.replace('border-l-4', 'bg').replace('-600', '-100')}`}>
            {icon}
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center">
        <div className="text-red-600 mb-4">{error}</div>
        <button
          onClick={fetchDashboardData}
          className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Overview of your café management system</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Categories"
          value={stats?.category || 0}
          icon={<SquaresPlusIcon className="h-6 w-6 text-blue-600" />}
          color="border-l-blue-600"
          change={{ value: 12, type: 'increase' }}
        />
        <StatCard
          title="Total Products"
          value={stats?.product || 0}
          icon={<ShoppingBagIcon className="h-6 w-6 text-green-600" />}
          color="border-l-green-600"
          change={{ value: 8, type: 'increase' }}
        />
        <StatCard
          title="Total Orders"
          value={stats?.bill || 0}
          icon={<ClipboardDocumentListIcon className="h-6 w-6 text-amber-600" />}
          color="border-l-amber-600"
          change={{ value: 5, type: 'increase' }}
        />
        <StatCard
          title="Total Users"
          value={stats?.user || 0}
          icon={<UsersIcon className="h-6 w-6 text-purple-600" />}
          color="border-l-purple-600"
          change={{ value: 3, type: 'decrease' }}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Sales Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Weekly Sales</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={salesData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="sales" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Distribution */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Category Distribution</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue Trend */}
        <div className="bg-white rounded-lg shadow-md p-6 lg:col-span-2">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={salesData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="sales" stroke="#8884d8" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Link
            to="/admin/categories"
            className="bg-blue-50 hover:bg-blue-100 p-4 rounded-lg flex items-center transition-colors"
          >
            <SquaresPlusIcon className="h-6 w-6 text-blue-600 mr-3" />
            <span className="font-medium">Manage Categories</span>
          </Link>
          <Link
            to="/admin/products"
            className="bg-green-50 hover:bg-green-100 p-4 rounded-lg flex items-center transition-colors"
          >
            <ShoppingBagIcon className="h-6 w-6 text-green-600 mr-3" />
            <span className="font-medium">Manage Products</span>
          </Link>
          <Link
            to="/admin/bills"
            className="bg-amber-50 hover:bg-amber-100 p-4 rounded-lg flex items-center transition-colors"
          >
            <ClipboardDocumentListIcon className="h-6 w-6 text-amber-600 mr-3" />
            <span className="font-medium">View Bills</span>
          </Link>
          <Link
            to="/admin/users"
            className="bg-purple-50 hover:bg-purple-100 p-4 rounded-lg flex items-center transition-colors"
          >
            <UsersIcon className="h-6 w-6 text-purple-600 mr-3" />
            <span className="font-medium">Manage Users</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
