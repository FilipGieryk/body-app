import { useState } from "react";
import axios from "axios";
import { register } from "../../../api/authService";
import { useMutation } from "@tanstack/react-query";

const useRegister = (onLoginSuccess) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const mutation = useMutation({
    mutationFn: () => register(username, password, email),
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
  };
};

export default useRegister;
