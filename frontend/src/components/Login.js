import React, { useState } from "react";
import axios from "axios";
import "./Login.css";

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
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("isAdmin", response.data.isAdmin);
        onLoginSuccess();
      } else if (activeTab === "register") {
        console.log(activeTab);
        const response = await axios.post("http://localhost:3000/api/users", {
          username,
          password,
          email,
        });
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
      className={`login ${!isVisible ? "login-hide" : ""}`}
      id="login-container"
    >
      <div className="login-header-container">
        <h1
          className={`login-header-element ${
            activeTab === "login" ? "active" : ""
          }`}
          onClick={() => setActiveTab("login")}
        >
          Login
        </h1>
        <h1
          className={`login-header-element ${
            activeTab === "register" ? "active" : ""
          }`}
          onClick={() => setActiveTab("register")}
        >
          Register
        </h1>
      </div>

      <form id="login-form" onSubmit={handleSubmit}>
        <div class="input">
          <input
            class="login-input"
            type="text"
            id="username"
            name="username"
            placeholder="login"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <span class="underline"></span>
          <label class="label">login</label>
        </div>
        <br />
        {activeTab === "register" && (
          <div className="input">
            <input
              className="login-input"
              type="email"
              id="email"
              name="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <span className="underline"></span>
            <label className="label">Email</label>
          </div>
        )}
        <div class="input">
          <input
            class="login-input"
            type="password"
            id="password"
            name="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span class="underline"></span>
          <label class="label">password</label>
          <br />
        </div>
        <input
          type="submit"
          value={activeTab === "login" ? "Login" : "Register"}
          id="login-form-submit"
        />
      </form>
    </div>
  );
};

export default Login;
