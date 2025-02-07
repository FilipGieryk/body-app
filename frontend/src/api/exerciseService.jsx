import axios from "axios";

export const fetchExercisesByBodyPart = async (bodyPart, limit = 2) => {
  try {
    const response = await axios.get("/api/admin/exercises/body-part", {
      params: { bodyPart, limit }, // Use query parameters
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      // Server responded with a non-2xx status
      throw new Error(`Server error: ${error.response.status}`);
    } else if (error.request) {
      // No response received
      throw new Error("Network error: No response from server");
    } else {
      // Something went wrong in the request setup
      throw new Error(`Request error: ${error.message}`);
    }
  }
};

export const fetchExercises = async () => {
  try {
    const response = await axios.get("/api/admin/exercises"); // Use query parameters
    return response.data;
  } catch (error) {
    if (error.response) {
      // Server responded with a non-2xx status
      throw new Error(`Server error: ${error.response.status}`);
    } else if (error.request) {
      // No response received
      throw new Error("Network error: No response from server");
    } else {
      // Something went wrong in the request setup
      throw new Error(`Request error: ${error.message}`);
    }
  }
};

export const fetchExerciseById = async () => {
  try {
    const response = await axios.get(`/api/admin/exercises/${exerciseId}`);
    setExercise(response.data);
  } catch (error) {
    console.error("failed to fetch exercise", error);
  }
};

export const updateExercise = async (id, exerciseData) => {
  try {
    const response = await axios.put(`/api/admin/exercises/:id`, exerciseData);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(`Server error: ${error.response.status}`);
    } else if (error.request) {
      // No response received
      throw new Error("Network error: No response from server");
    } else {
      // Something went wrong in the request setup
      throw new Error(`Request error: ${error.message}`);
    }
  }
};
