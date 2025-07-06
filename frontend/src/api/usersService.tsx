import axios from "axios";

const headers = {
  Authorization: `Bearer ${localStorage.getItem("token")}`,
  "Content-Type": "application/json",
};

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
export const addUserPhoto = async (formData): Promise<void> => {
  try {
    await axios.put(`/api/users/photos`, formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "multipart/form-data",
      },
    });
  } catch (error: any) {
    console.error("Failed to add photo", error);
    throw error;
  }
};
export const deleteUserPhoto = async (
  updatedPhotos: string[]
): Promise<void> => {
  try {
    await axios.delete(`/api/users/photos`, {
      data: { photos: updatedPhotos },
      headers,
    });
  } catch (error: any) {
    console.error("Failed to delete photo", error);
    throw error;
  }
};

export const updateUser = async (updatedFields: Partial<User>) => {
  try {
    const response = await axios.put(`/api/users/`, updatedFields, { headers });
    return response.data;
  } catch (error) {
    console.error("Error updating user info", error);
    throw error;
  }
};
