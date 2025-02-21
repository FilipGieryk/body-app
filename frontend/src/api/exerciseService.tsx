import axios from "axios";

export interface Exercise {
  name: string;
  bodyPart: [];
  media: any;
  averageRating: number;
  ratingCount: number;
}

export const fetchExercisesByBodyPart = async (bodyPart: any, limit = 2) => {
  try {
    const response = await axios.get("/api/admin/exercises/body-part", {
      params: { bodyPart, limit },
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(`Server error: ${error.response.status}`);
    } else if (error.request) {
      throw new Error("Network error: No response from server");
    } else {
      throw new Error(`Request error: ${error.message}`);
    }
  }
};

export const fetchExercises = async () => {
  try {
    const response = await axios.get("/api/admin/exercises");
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(`Server error: ${error.response.status}`);
    } else if (error.request) {
      throw new Error("Network error: No response from server");
    } else {
      throw new Error(`Request error: ${error.message}`);
    }
  }
};

export const fetchExerciseById = async (exerciseId: string) => {
  try {
    const response = await axios.get(
      `/api/admin/exercises/detail/${exerciseId}`
    );
    return response.data;
  } catch (error) {
    console.error("failed to fetch exercise", error);
    throw error;
  }
};

// export const updateExercise = async (id, exerciseData) => {
//   try {
//     const response = await axios.put(`/api/admin/exercises/:id`, exerciseData);
//     return response.data;
//   } catch (error) {
//     if (error.response) {
//       throw new Error(`Server error: ${error.response.status}`);
//     } else if (error.request) {
//       // No response received
//       throw new Error("Network error: No response from server");
//     } else {
//       // Something went wrong in the request setup
//       throw new Error(`Request error: ${error.message}`);
//     }
//   }
// };
