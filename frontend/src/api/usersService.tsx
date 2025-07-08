import api from "../api/axios";

export interface NewUser {
  username: string;
  email: string;
  password: string;
}

export interface User extends NewUser {
  photos: unknown;
  id: string;
}

export const addUser = async (newUser: NewUser): Promise<User> => {
  try {
    const response = await api.post("/users", newUser);
    return response.data;
  } catch (error: any) {
    console.error("error creating user", error);
    throw error;
  }
};

export const getUserById = async (id: string) => {
  try {
    const response = await api.get(`/users/${id}`);
    return response.data;
  } catch (error: any) {
    console.error("error fetching user", error);
    throw error;
  }
};

export const fetchUserInfo = async () => {
  try {
    const response = await api.get(`/users/me`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user info:", error);
    return null;
  }
};
export const addUserPhoto = async (formData): Promise<void> => {
  try {
    await api.put(`/users/photos`, formData);
  } catch (error: any) {
    console.error("Failed to add photo", error);
    throw error;
  }
};
export const deleteUserPhoto = async (
  updatedPhotos: string[]
): Promise<void> => {
  try {
    await api.post(`/users/photos/delete`, { photos: updatedPhotos });
  } catch (error: any) {
    console.error("Failed to delete photo", error);
    throw error;
  }
};

export const updateUser = async (updatedFields: Partial<User>) => {
  try {
    const response = await api.put(`/users/`, updatedFields);
    return response.data;
  } catch (error) {
    console.error("Error updating user info", error);
    throw error;
  }
};
