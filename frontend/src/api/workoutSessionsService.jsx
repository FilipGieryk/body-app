import axios from "axios";

export const addWorkoutSessions = async () => {
  try {
    const response = await axios.post(
      "/api/workout-sessions/add",
      {
        workoutId,
        modifiedExercises,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
  } catch (error) {
    console.error(error);
  }
};
