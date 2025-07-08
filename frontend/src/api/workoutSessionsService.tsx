import api from "../api/axios";

export interface WorkoutSession {
  workoutId: string;
  modifiedExercises: [];
}

export const addWorkoutSessions = async (workoutSession: WorkoutSession) => {
  try {
    console.log(workoutSession);
    await api.post("/workout-sessions/add", workoutSession);
  } catch (error) {
    console.error("error adding wokrout session", error);
    throw error;
  }
};
