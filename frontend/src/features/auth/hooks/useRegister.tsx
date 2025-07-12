import { useState } from "react";

import { register } from "../api/authService";
import { useMutation } from "@tanstack/react-query";

const useRegister = (onLoginSuccess: () => Promise<void>) => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  const mutation = useMutation({
    mutationFn: () => register({ username, password, email }),
    onSuccess: (data) => {
      localStorage.setItem("token", data.token); // Store the token
      onLoginSuccess();
    },
    onError: (error) => {
      console.error(error.response?.data?.message || "An error occurred");
    },
  });

  const handleRegister = (e) => {
    e.preventDefault();
    mutation.mutate();
  };
  return {
    username,
    setUsername,
    password,
    setPassword,
    email,
    setEmail,
    handleRegister,
    isLoading: isRegisterLoading,
  };
};

export default useRegister;
