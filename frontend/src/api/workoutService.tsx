import axios from "axios";

const API_URL = "/api/workouts";

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
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching workouts:", error);
  }
};

export const createWorkout = async (
  newWorkout: NewWorkout
): Promise<Workout> => {
  try {
    const response = await axios.post(API_URL, newWorkout, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Error creating workout:", error);
    throw error;
  }
};

// export const fetchWorkoutById = async (workoutId) => {
//   try {
//     const response = await axios.get(`/api/workouts/${workoutId}`);
//     const fetchedData = response.data;
//     setModifiedExercises(
//       fetchedData.exercises.map((exercise) => ({
//         ...exercise,
//       }))
//     );
//     setWorkoutDetails({
//       workoutName: fetchedData.name,
//       workoutCreator: fetchedData.user,
//     });
//   } catch (error) {
//     console.error("couldnt get workout", error);
//   }
// };
