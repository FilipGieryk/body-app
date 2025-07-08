import api from "../api/axios";

const URL = "/auth";

export const login = async (username, password) => {
  const response = await api.post(`${URL}/login`, { username, password });
  return response.data;
};

export const register = async (username, password, email) => {
  const response = await api.post(`${URL}/register`, {
    username,
    password,
    email,
  });
  return response.data;
};

// const handleSubmit = async (e) => {
//   e.preventDefault();
//   try {
//     if (activeTab === "login") {
//       console.log(activeTab);
//       const response = await axios.post(
//         "http://localhost:3000/api/auth/login",
//         {
//           username,
//           password,
//         }
//       );
//       setMessage(response.data.message);
//       localStorage.setItem("token", response.data.token);
//       localStorage.setItem("isAdmin", response.data.isAdmin);
//       onLoginSuccess();
//     } else if (activeTab === "register") {
//       const response = await axios.post(
//         "http://localhost:3000/api/auth/register",
//         {
//           username,
//           password,
//           email,
//         }
//       );
//       setMessage(response.data.message);
//       localStorage.setItem("token", response.data.token); // Store the token
//       onLoginSuccess();
//     }
//   } catch (error) {
//     setMessage(error.response?.data?.message || "An error occurred");
//   }
// };
