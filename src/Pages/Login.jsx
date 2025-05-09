import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import axiosInstance from "../api/axiosInterceptor";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const nav = useNavigate();
  const mutatation = useMutation({
    mutationFn: async (value) => {
      const res = await axiosInstance.post("/user/login", value);
      return res.data;
    },
    onSuccess: (data) => {
      const { message, user } = data;
      toast.success(message);
      if (user.role === "admin") {
        localStorage.setItem("role", user.role);
        nav("/Admin");
      } else {
        localStorage.setItem("role", user.role);
        nav("/");
      }
    },
    onError: () => {
      const { message } = error;
      toast.error(message);
    },
  });
  const handleLogin = (e) => {
    e.preventDefault();
    mutatation.mutate({ email, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-6 rounded shadow-md w-80"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
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
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Login
        </button>
        <button
          type="button"
          onClick={() => nav("/signup")}
          className="w-full mt-2 bg-gray-200 text-gray-700 p-2 rounded hover:bg-gray-300"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default Login;
