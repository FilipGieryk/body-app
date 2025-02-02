import axios from "axios";

const API_URL = "/api/workouts";

export const fetchWorkouts = async (workoutIds) => {
  const response = await axios.get(`${API_URL}/get-workouts`, {
    params: { workoutIds: workoutIds.join(",") },
  });
  return response.data;
};
