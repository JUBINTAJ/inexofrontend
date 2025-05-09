import { useEffect, useState } from 'react';
import { AlertCircle, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import axiosInstance from '../api/axiosInterceptor';
import { toast } from 'react-toastify';

export default function EmploymentForm() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [editComplaintId, setEditComplaintId] = useState(null);

  const { data: users = [], isLoading: usersLoading } = useQuery({
    queryKey: ['allUsers'],
    queryFn: async () => {
      const res = await axiosInstance.get('/admin/allusers');
      return res.data.data.users;
    },
  });

  const { data: complaints = [], isLoading: complaintsLoading } = useQuery({
    queryKey: ['userComplaints', selectedUser?._id],
    queryFn: async () => {
      const res = await axiosInstance.get(`/admin/complaints/${selectedUser._id}`);
      return res.data.complaint;
    },
    enabled: !!selectedUser,
  });

  
  const createComplaint = useMutation({
    mutationFn: async ({ title, description, userId,  }) => {
      const res = await axiosInstance.put(`/admin/complaints/${userId}/assign`, {
        title,
        description,
        userId,
      });
      console.log(res.data.complaint,'loo');
      return res.data;
    },
    onSuccess: () => {
      toast.success('Complaint updated/assigned!');
      setModalType(null);
      setTitle('');
      setDescription('');
    },
    onError: (err) => {
      console.error(err);
      toast.error('Error updating complaint');
    },
  });
  


  const editComplaint = useMutation({
    mutationFn: async ({ title, description, complaintId,assignedTo    }) => {
        console.log(assignedTo ,',loo');
      const res = await axiosInstance.put(`/admin/complaints/${complaintId}`, {
        complaintId,
        title,
        description,
      });

      console.log(res.data,'kkkk');
      return res.data;
    },
    onSuccess: () => {
      toast.success('Complaint updated!');
      setModalType(null);
      setTitle('');
      setDescription('');
    },
    onError: (err) => {
        const {message}=err;
        toast.error(message); 
    },
  });

  const handleUserClick = (user) => {
    setSelectedUser(user);
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
    setTitle('');
    setDescription('');
};

const handlecloseedit=()=>{
    setModalType(null);
      setEditComplaintId(null);

  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (modalType === 'create') {
      createComplaint.mutate({
        title,
        description,
        userId: selectedUser._id,
      });
    } else if (modalType === 'edit') {
      editComplaint.mutate({
        title,
        description,
        complaintId: editComplaintId,
      });
    }
  };

  const handleEditClick = (complaint) => {
    setTitle(complaint.title);
    setDescription(complaint.description);
    setEditComplaintId(complaint._id);
    setModalType('edit');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen space-y-6 px-40">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Employment Menu</h1>
      </div>

      <div className="flex justify-start w-full">
        <Link to="/Admin" className="text-blue-600 hover:text-blue-900 font-semibold">
          &larr; Back to Dashboard
        </Link>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white shadow-sm w-full">
        <div className="p-6">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {usersLoading ? (
                <tr>
                  <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">
                    Loading users...
                  </td>
                </tr>
              ) : users.length > 0 ? (
                users.map((user) => (
                  <tr
                    key={user._id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleUserClick(user)}
                  >
                    <td className="px-6 py-4 font-medium text-gray-900">{user.username}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold text-green-800">
                        Active
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">
                    <div className="flex flex-col items-center justify-center py-6">
                      <AlertCircle className="h-10 w-10 text-gray-400" />
                      <p className="mt-2 text-base font-medium">No users found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-white/30">
          <div className="bg-white rounded-xl shadow-lg p-6 w-[600px] max-h-[80vh] overflow-y-auto relative">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              onClick={handleCloseModal}
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold mb-4 text-gray-800">
              Complaints for {selectedUser.username}
            </h2>

            {complaintsLoading ? (
              <p className="text-sm text-gray-500">Loading complaints...</p>
            ) : complaints.length > 0 ? (
              complaints.map((complaint, index) => (
                <div key={complaint._id || index} className="mb-4 border-b pb-2">
                  <p className="text-sm text-gray-700">
                    <strong>Title:</strong> {complaint.title}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Description:</strong> {complaint.description}
                  </p>
                  <p className="text-xs text-gray-500">
                    <strong>Status:</strong> {complaint.status}
                  </p>
                  <button
                    onClick={() => handleEditClick(complaint)}
                    className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No complaints found.</p>
            )}

            <div className="mt-4 flex space-x-4">
              <button
                onClick={() => setModalType('create')}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {modalType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/40">
          <div className="bg-white p-6 rounded-lg shadow-md w-[400px] relative">
            <button
              onClick={handlecloseedit}
              className="absolute top-3 right-3 text-gray-500 hover:text-black"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-semibold mb-4 capitalize">{modalType} Complaint</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2 mb-4 border rounded"
                required
              />
              <textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2 mb-4 border rounded"
                required
              />
              <button
                type="submit"
                className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
              >
                {modalType === 'create' ? 'Create Complaint' : 'Save Changes'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
