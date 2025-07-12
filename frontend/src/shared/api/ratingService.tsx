import api from "./axios";
const API_URL = "/rating";

export interface Rating {
  user: any;
  content: any;
  rating: number;
}

export const submitRating = async (itemId: string, rating: number) => {
  try {
    const response = await api.post(`${API_URL}/${itemId}`, rating);
    return response.data;
  } catch (error: any) {
    console.error("Error adding rating:", error);
  }
};
