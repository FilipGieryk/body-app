import axios from "axios";

export const addUser = async (e) => {
  e.preventDefault();
  try {
    const response = await axios.post("/api/users", formData);
    setMessage("User ${response.data.username} created successfully");
  } catch (err) {
    setMessage(err.response?.data?.error || "An error occurred");
  }
};

export const getUserById = async () => {
  try {
    const response = await axios.get(`/api/users/${id}`);
    setUserInfo(response.data);
  } catch (err) {
    console.error("error fetching user", err);
  } finally {
    setLoading(false);
  }
};
if (loggedUserInfo && id === loggedUserInfo._id) {
  setUserInfo(loggedUserInfo); // Use loggedUserInfo directly
  setLoading(false);
} else {
  fetchUser(); // Fetch other user's data
}

export const updateUser = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.put(
      `/api/users/${userInfo._id}`,
      {
        username: userInfo.username,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setUserInfo(response.data);
    alert("User info updated successfully");
    setIsEditing(false); // Exit edit mode after saving
  } catch (error) {
    console.error("Error updating user info", error);
  }
};

export const deletUserPhoto = async (photoPath) => {
  try {
    const token = localStorage.getItem("token");
    await axios.delete(`/api/users/${userId}/photos`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: { photoPath },
    });
    setUserPhotos((prevUserInfo) => ({
      ...prevUserInfo,
      photos: prevUserInfo.photos.filter((photo) => photo !== photoPath),
    }));
  } catch (error) {
    console.error("Failed to delete photo", error);
  }
};
