import api from "../../../shared/api/axios";

const API_URL = "/workouts";

export interface NewWorkout {
  name: string;
  exercises: any;
  // user: any;
  // description: string;
  // createdAt: Date;
  // media: string;
  // averageRating: number;
  // ratingCount: number;
  // bodyPart: any;
  // originalWorkout: any;
}

export interface Workout extends NewWorkout {
  id: string;
}

export const fetchWorkouts = async () => {
  try {
    const response = await api.get(API_URL);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching workouts:", error);
  }
};

export const createWorkout = async (
  newWorkout: NewWorkout
): Promise<Workout> => {
  try {
    const response = await api.post(API_URL, newWorkout);
    return response.data;
  } catch (error: any) {
    console.error("Error creating workout:", error);
    throw error;
  }
};

export const fetchWorkoutById = async (workoutId) => {
  try {
    const response = await api.get(`/workouts/${workoutId}`);
    return response.data;
  } catch (error) {
    console.error("couldnt get workout", error);
    throw error;
  }
};
