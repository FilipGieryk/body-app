import axios from "axios";

const API_URL = "/api/rating";

export const submitRating = async (itemId, rating) => {
  const token = localStorage.getItem("token");
  const response = await axios.post(
    `${API_URL}/${itemId}`,
    {
      rating,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`, // Set the Authorization header with the token
      },
    }
  );
  return response.data;
};
