import { useState } from "react";
import axios from "axios";
import { login } from "../api/authService";
import { useMutation } from "@tanstack/react-query";

const useLogin = (onLoginSuccess: () => Promise<void>) => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const mutation = useMutation({
    mutationFn: () => login({ username, password }),
    onSuccess: async (data) => {
      document.cookie = `token=${data.token}; path=/; max-age=${
        60 * 60 * 24 * 7
      }`;

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
    isLoading: mutation.isLoading,
  };
};

export default useLogin;
