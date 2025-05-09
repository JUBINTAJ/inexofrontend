import { useNavigate } from 'react-router-dom';
import { Users, ClipboardList } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import axiosInstance from '../api/axiosInterceptor';

export default function Dashboard() {
  const navigate = useNavigate();


    const logoutMutation = useMutation({
    mutationFn: async (userdata) => {
      const res= await axiosInstance.post("user/logout",userdata);
      return res.data
    },
    onSuccess: (data) => {
      toast.success("Logout successful!");
      localStorage.clear(); 
      setTimeout(() => {
        navigate("/Login");
      }, 1000);
    },
    onError: () => {
      toast.error("Logout failed. Please try again.");
    },
  });

    const handleLogout = () => {
    logoutMutation.mutate();
  };


  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <button
        onClick={handleLogout}
        className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
      >
        Logout
      </button>

      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Employee Management System
        </p>
      </div>
      
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Link
          to="/Employemenu"
          className="group rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md"
        >
          <div className="flex items-center">
            <div className="rounded-md bg-blue-100 p-3 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <ClipboardList className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h2 className="font-semibold text-gray-900">Employment Menu</h2>
              <p className="mt-1 text-sm text-gray-500">
                Manage employee information and employment details
              </p>
            </div>
          </div>
        </Link>

        <Link
          to="/Userlist"
          className="group rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md"
        >
          <div className="flex items-center">
            <div className="rounded-md bg-purple-100 p-3 text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <Users className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h2 className="font-semibold text-gray-900">Users List</h2>
              <p className="mt-1 text-sm text-gray-500">
                View and manage all employees in the system
              </p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
