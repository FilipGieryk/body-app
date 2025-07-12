import { useState } from "react";
import axios from "axios";
import { login } from "../../../api/authService";
import { useMutation } from "@tanstack/react-query";

const useLogin = (onLoginSuccess) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const mutation = useMutation({
    mutationFn: () => login(username, password),
    onSuccess: async (data) => {
      localStorage.setItem("token", data.token);
      localStorage.setItem("isAdmin", data.isAdmin);

      await onLoginSuccess();
    },
    onError: (error) => {
      console.error(error.response?.data?.message || "An error occurred");
    },
  });

  const handleLogin = (e) => {
    e.preventDefault();
    mutation.mutate();
  };
  return {
    username,
    setUsername,
    password,
    setPassword,
    handleLogin,
  };
};

export default useLogin;
