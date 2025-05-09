import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../api/axiosInterceptor";
import { useNavigate } from "react-router-dom";

const fetchUserComplaints = async () => {
  const res = await axiosInstance.get("/user/complaints");
  return res.data.complaint;
};

const updateComplaint = async ({ id, updatedData }) => {
  const res = await axiosInstance.put(`/user/complaints/${id}`, updatedData);
  console.log(res.data);
  return res.data;
};

export default function UserComplaintsPage() {

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editData, setEditData] = useState({ _id: "", title: "", description: "" ,status:""});
  const nav=useNavigate()





  const queryClient = useQueryClient();
  const { data: complaints = [], isLoading, error } = useQuery({
    queryKey: ["userComplaints"],
    queryFn: fetchUserComplaints,
  });

  const mutation = useMutation({
    mutationFn: updateComplaint,
    onSuccess: () => {
      queryClient.invalidateQueries(["userComplaints"]);
      setIsDialogOpen(false);
    },
  });


  const handleEditClick = (complaint) => {
    setEditData(complaint);
    setIsDialogOpen(true);
  };

  const handleInputChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    mutation.mutate({
      id: editData._id,
      updatedData: {
        title: editData.title,
        description: editData.description,
        status : editData.status,
      },
    });
  };

  const pendingCount = complaints.filter((c) => c.status === "pending").length;
  const closedCount = complaints.filter((c) => c.status === "closed").length;
  const excludedCount = complaints.filter((c) => c.status === "excluded").length;


  
  return (
    <div className="max-w-7xl mx-auto py-10 px-4">
      <div className="flex justify-end mb-4">
  <button
    onClick={() => nav('/Login') 
     
    }
    className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
  >
    Login
  </button>
</div>

      <div className="bg-white p-6 rounded shadow mb-6">
        <h2 className="text-2xl font-bold mb-2">My Complaints</h2>
        <p className="text-gray-600 mb-6">Overview of your submitted complaints</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-yellow-100 text-yellow-800 p-4 rounded shadow">
            <h3 className="text-lg font-semibold">Pending</h3>
            <p className="text-3xl">{pendingCount}</p>
          </div>
          <div className="bg-green-100 text-green-800 p-4 rounded shadow">
            <h3 className="text-lg font-semibold">Closed</h3>
            <p className="text-3xl">{closedCount}</p>
          </div>
          <div className="bg-red-100 text-red-800 p-4 rounded shadow">
            <h3 className="text-lg font-semibold">Excluded</h3>
            <p className="text-3xl">{excludedCount}</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">All Complaints</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 border">Title</th>
                <th className="px-4 py-2 border">Description</th>
                <th className="px-4 py-2 border">Status</th>
                <th className="px-4 py-2 border">Edit</th>
              </tr>
            </thead>
            <tbody>
              {complaints.map((complaint) => (
                <tr key={complaint._id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border">{complaint.title}</td>
                  <td className="px-4 py-2 border">{complaint.description}</td>
                  <td className="px-4 py-2 border capitalize">{complaint.status}</td>
                  <td className="px-4 py-2 border">
                    <button
                      onClick={() => handleEditClick(complaint)}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-white/30">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
            <h3 className="text-xl font-semibold mb-4">Edit Complaint</h3>

            <div className="mb-4">
              <label className="block font-medium mb-1">Title</label>
              <input
                type="text"
                name="title"
                value={editData.title}
                onChange={handleInputChange}
                className="w-full border px-3 py-2 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block font-medium mb-1">Description</label>
              <textarea
                name="description"
                value={editData.description}
                onChange={handleInputChange}
                className="w-full border px-3 py-2 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block font-medium mb-1">status</label>
              <input
                type="text"
                name="status"
                value={editData.status}
                onChange={handleInputChange}
                className="w-full border px-3 py-2 rounded"
              />
            </div>

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsDialogOpen(false)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
