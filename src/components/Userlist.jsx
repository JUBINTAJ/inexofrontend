import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../api/axiosInterceptor';

export default function UsersList() {
  const fetchAllUsers = async () => {
    const res = await axiosInstance.get('/admin/allusers');
    console.log(res.data.data.users);
    return res.data.data.users;
  };

  const { data: users = [], isLoading, error } = useQuery({
    queryKey: ['allUsers'],
    queryFn: fetchAllUsers,
  });


  

  if (isLoading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">Error fetching users</p>;

  return (
    <div className="flex justify-center items-center space-y-6">
      <div className="w-full max-w-5xl">
        <div className="flex items-center mb-6">
          <div className="flex justify-start w-full">
            <Link to="/Admin" className="text-blue-600 hover:text-blue-900 font-semibold">
              &larr; Back to Dashboard
            </Link>
          </div>
          <div className="text-sm text-gray-500">
            Total Users: <span className="font-medium text-gray-900">{users.length}</span>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="p-6 overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Username</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Password</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {users.length > 0 ? (
                  users.map((user) => (
                    <tr key={user._id}>
                      <td className="px-6 py-4 text-sm text-gray-900">{user.username}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{user.password}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
