import React, { useState } from "react";
import useLogin from "../../hooks/useLogin";
import useRegister from "../../hooks/useRegister";

const Login = ({ isVisible, onLoginSuccess, loginStatus }) => {
  const [activeTab, setActiveTab] = useState(loginStatus);

  const {
    username: loginUsername,
    setUsername: setLoginUsername,
    password: loginPassword,
    setPassword: setLoginPassword,
    handleLogin,
    isLoading: isLoginLoading,
  } = useLogin(onLoginSuccess);

  const {
    username: registerUsername,
    setUsername: setRegisterUsername,
    password: registerPassword,
    setPassword: setRegisterPassword,
    email,
    setEmail,
    handleRegister,
    isLoading: isRegisterLoading,
  } = useRegister(onLoginSuccess);

  return (
    <div
      className={`animate-login duration-200 flex absolute flex-col justify-center items-center h-90 bottom-50 right-200 blur-s z-200 w-120 my-auto p-8 border-2 rounded-2xl shadow ${
        !isVisible ? "login-hide" : ""
      }`}
      id="login-container"
    >
      <div className="absolute left-20 top-0 text-base w-56 rounded-2xl px-2 py-4">
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

      {activeTab === "login" && (
        <form id="login-form" onSubmit={handleLogin}>
          <div className="mx-4">
            <input
              className="w-full p-2 border-0 border-b-1"
              type="text"
              id="username"
              name="username"
              placeholder="Username"
              value={loginUsername}
              onChange={(e) => setLoginUsername(e.target.value)}
            />
            <span className="block h-0.5 bg-amber-50"></span>
            <label className="absolute inset-0 pointer-events-none text-2xl text-transparent ">
              Username
            </label>
          </div>
          <br />
          <div className="mx-4">
            <input
              className="w-full p-2 border-0 border-b-1"
              type="password"
              id="password"
              name="password"
              placeholder="Password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
            />
            <span className="block h-0.5 bg-amber-50"></span>
            <label className="absolute inset-0 pointer-events-none text-2xl text-transparent ">
              Password
            </label>
            <br />
          </div>
          <input
            type="submit"
            className="w-full px-2.8 text-black border-1 rounded-xl cursor-pointer transition-all"
            value={isLoginLoading ? "Logging in..." : "Login"}
            id="login-form-submit"
            disabled={isLoginLoading}
          />
        </form>
      )}

      {activeTab === "register" && (
        <form id="register-form" onSubmit={handleRegister}>
          <div className="mx-4">
            <input
              className="w-full p-2 border-0 border-b-1"
              type="text"
              id="register-username"
              name="register-username"
              placeholder="Username"
              value={registerUsername}
              onChange={(e) => setRegisterUsername(e.target.value)}
            />
            <span className="block h-0.5 bg-amber-50"></span>
            <label className="absolute inset-0 pointer-events-none text-2xl text-transparent ">
              Username
            </label>
          </div>
          <br />
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
          <br />
          <div className="mx-4">
            <input
              className="w-full p-2 border-0 border-b-1"
              type="password"
              id="register-password"
              name="register-password"
              placeholder="Password"
              value={registerPassword}
              onChange={(e) => setRegisterPassword(e.target.value)}
            />
            <span className="block h-0.5 bg-amber-50"></span>
            <label className="absolute inset-0 pointer-events-none text-2xl text-transparent ">
              Password
            </label>
            <br />
          </div>
          <input
            type="submit"
            className="w-full px-2.8 text-black border-1 rounded-xl cursor-pointer transition-all"
            value={isRegisterLoading ? "Registering..." : "Register"}
            id="register-form-submit"
            disabled={isRegisterLoading}
          />
        </form>
      )}
    </div>
  );
};

export default Login;
