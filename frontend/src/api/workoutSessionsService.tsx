import axios from "axios";

export interface WorkoutSession {
  workoutId: string;
  modifiedExercises: [];
}

export const addWorkoutSessions = async (workoutSession: WorkoutSession) => {
  try {
    await axios.post("/api/workout-sessions/add", workoutSession, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
  } catch (error) {
    console.error("error adding wokrout session", error);
    throw error;
  }
};
