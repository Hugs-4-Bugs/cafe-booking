import { useEffect, useState } from 'react';
import userService, { IUser } from '../../services/userService';
import { UserCircleIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const Users = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await userService.getAllUsers();
      setUsers(response.data);
    } catch (err) {
      console.error('Failed to fetch users:', err);
      setError('Failed to load users. Please try again later.');
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (userId: number, currentStatus: string) => {
    const newStatus = currentStatus === 'true' ? 'false' : 'true';

    try {
      await userService.updateUserStatus(userId, newStatus);
      toast.success(`User ${newStatus === 'true' ? 'activated' : 'deactivated'} successfully`);
      fetchUsers(); // Refresh the list
    } catch (err) {
      console.error('Error updating user status:', err);
      toast.error('Failed to update user status');
    }
  };

  if (loading && users.length === 0) {
    return (
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Users</h1>
          <p className="mt-2 text-sm text-gray-700">Manage user accounts and access</p>
        </div>
      </div>

      <div className="mt-8">
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          {error && (
            <div className="p-4 bg-red-50 text-red-700 border-l-4 border-red-500">
              {error}
            </div>
          )}

          <ul className="divide-y divide-gray-200">
            {users.length === 0 ? (
              <li className="px-6 py-4 text-center text-gray-500">
                No users found.
              </li>
            ) : (
              users.map((user) => (
                <li key={user.id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <UserCircleIcon className="h-10 w-10 text-gray-400" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-sm font-medium text-gray-900">{user.name}</h3>
                        <div className="mt-1 text-sm text-gray-500">
                          <p>{user.email}</p>
                          <p>{user.contactNumber}</p>
                        </div>
                        <div className="mt-1 flex items-center">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.status === 'true' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {user.status === 'true' ? 'Active' : 'Inactive'}
                          </span>
                          <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                            {user.role === 'admin' ? 'Admin' : 'User'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div>
                      {user.role !== 'admin' && (
                        <button
                          onClick={() => handleToggleStatus(user.id, user.status)}
                          className={`inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md ${
                            user.status === 'true'
                              ? 'text-red-700 bg-red-100 hover:bg-red-200'
                              : 'text-green-700 bg-green-100 hover:bg-green-200'
                          }`}
                        >
                          {user.status === 'true' ? (
                            <>
                              <XCircleIcon className="mr-1.5 h-4 w-4" />
                              Deactivate
                            </>
                          ) : (
                            <>
                              <CheckCircleIcon className="mr-1.5 h-4 w-4" />
                              Activate
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Users;
