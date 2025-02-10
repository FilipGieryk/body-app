import axios from "axios";

const API_URL = "/api/rating";

export interface Rating {
  user: any;
  content: any;
  rating: number;
}

export const submitRating = async (itemId: string, rating: number) => {
  try {
    const response = await axios.post(`${API_URL}/${itemId}`, rating, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Error adding rating:", error);
  }
};
