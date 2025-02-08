import React, { useState } from "react";
import axios from "axios";

const Login = ({ isVisible, onLoginSuccess, loginStatus }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [activeTab, setActiveTab] = useState(loginStatus);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (activeTab === "login") {
        console.log(activeTab);
        const response = await axios.post(
          "http://localhost:3000/api/auth/login",
          {
            username,
            password,
          }
        );
        setMessage(response.data.message);
        console.log(response.data);
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("isAdmin", response.data.isAdmin);
        onLoginSuccess();
      } else if (activeTab === "register") {
        const response = await axios.post(
          "http://localhost:3000/api/auth/register",
          {
            username,
            password,
            email,
          }
        );
        setMessage(response.data.message);
        localStorage.setItem("token", response.data.token); // Store the token
        onLoginSuccess();
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "An error occurred");
    }
  };

  return (
    <div
      className={`animate-[moveLogin] flex absolute flex-col justify-center items-center h-20 -top-28 right-28 blur-xs z-200 w-80 my-auto p-8 border-2 rounded-2xl shadow ${
        !isVisible ? "login-hide" : ""
      }`}
      id="login-container"
    >
      <div className="absolute top-8 text-2xl w-56 rounded-2xl px-2 py-4">
        <h1
          className={`inline cursor-pointer px-2 py-4 rounded-xl transition-all ${
            activeTab === "login" ? "active" : ""
          }`}
          onClick={() => setActiveTab("login")}
        >
          Login
        </h1>
        <h1
          className={`inline cursor-pointer px-2 py-4 rounded-xl transition-all ${
            activeTab === "register" ? "active" : ""
          }`}
          onClick={() => setActiveTab("register")}
        >
          Register
        </h1>
      </div>

      <form id="login-form" onSubmit={handleSubmit}>
        <div class="mx-4">
          <input
            class="w-full p-2 border-0 border-b-1"
            type="text"
            id="username"
            name="username"
            placeholder="login"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <span class="block h-0.5 bg-amber-50"></span>
          <label class="absolute inset-0 pointer-events-none text-2xl text-transparent ">
            login
          </label>
        </div>
        <br />
        {activeTab === "register" && (
          <div className="mx-4">
            <input
              className="w-full p-2 border-0 border-b-1"
              type="email"
              id="email"
              name="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <span className="block h-0.5 bg-amber-50"></span>
            <label className="absolute inset-0 pointer-events-none text-2xl text-transparent ">
              Email
            </label>
          </div>
        )}
        <div class="mx-4">
          <input
            class="w-full p-2 border-0 border-b-1"
            type="password"
            id="password"
            name="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span class="block h-0.5 bg-amber-50"></span>
          <label class="absolute inset-0 pointer-events-none text-2xl text-transparent ">
            password
          </label>
          <br />
        </div>
        <input
          type="submit"
          className="w-full px-2.8 text-white border-0 rounded-xl cursor-pointer transition-all"
          value={activeTab === "login" ? "Login" : "Register"}
          id="login-form-submit"
        />
      </form>
    </div>
  );
};

export default Login;
