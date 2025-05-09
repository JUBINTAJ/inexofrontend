import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import axiosInstance from "../api/axiosInterceptor";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: async (values) => {
      const response = await axiosInstance.post(`/user/signup`, values);
      console.log(response.data);
      return response.data;
    },
    onSuccess: (data) => {
      const { message } = data;
      toast.success(message);
      navigate("/Login");
    },
    onError: (error) => {
      const { message } = error;
      toast.error(message);
    },
  });

  const handleSignup = (e) => {
    e.preventDefault();
    mutation.mutate({ email, password, username });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSignup}
        className="bg-white p-6 rounded shadow-md w-80"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Sign Up</h2>
        <button
          type="button"
          onClick={() => navigate("/Login")}
          className="w-full mt-1 mb-2 bg-gray-200 text-gray-700 p-2 rounded hover:bg-gray-300"
        >
          Login
        </button>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
          required
        />
        <button
          type="submit"
          className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default Signup;
