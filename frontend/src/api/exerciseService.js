import axios from "axios";

export const fetchExercises = async (bodyPart, limit = 2) => {
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
