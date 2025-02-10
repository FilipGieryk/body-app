import axios from "axios";

export interface NewUser {
  username: string;
  email: string;
  password: string;
}

export interface User extends NewUser {
  id: string;
}

export const addUser = async (newUser: NewUser): Promise<User> => {
  try {
    const response = await axios.post("/api/users", newUser);
    return response.data;
  } catch (error: any) {
    console.error("error creating user", error);
    throw error;
  }
};

export const getUserById = async (id: string) => {
  try {
    const response = await axios.get(`/api/users/${id}`);
    return response.data;
  } catch (error: any) {
    console.error("error fetching user", error);
    throw error;
  }
};

// export const updateUser = async (id:string) => {
//   try {
//     const token = localStorage.getItem("token");
//     const response = await axios.put(
//       `/api/users/${id}`,
//       {
//         username: userInfo.username,
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );
//     setUserInfo(response.data);
//     alert("User info updated successfully");
//     setIsEditing(false); // Exit edit mode after saving
//   } catch (error) {
//     console.error("Error updating user info", error);
//   }
// };

// export const deletUserPhoto = async (photoPath) => {
//   try {
//     const token = localStorage.getItem("token");
//     await axios.delete(`/api/users/${userId}/photos`, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//       data: { photoPath },
//     });
//     setUserPhotos((prevUserInfo) => ({
//       ...prevUserInfo,
//       photos: prevUserInfo.photos.filter((photo) => photo !== photoPath),
//     }));
//   } catch (error) {
//     console.error("Failed to delete photo", error);
//   }
// };
