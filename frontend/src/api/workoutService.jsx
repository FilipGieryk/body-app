import axios from "axios";

const API_URL = "/api/workouts";

export const fetchWorkouts = async (workoutIds) => {
  const response = await axios.get(`${API_URL}/get-workouts`, {
    params: { workoutIds: workoutIds.join(",") },
  });
  return response.data;
};

export const createWorkout = async (event) => {
  event.preventDefault();
  try {
    const response = await axios.post(
      "/api/workouts/create",
      {
        name,
        description,
        exercises,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("Workout added successfully:", response.data);
  } catch (error) {
    console.error("Error adding workout:", error);
  }
};

export const fetchWorkoutById = async (workoutId) => {
  try {
    const response = await axios.get(`/api/workouts/${workoutId}`);
    const fetchedData = response.data;
    setModifiedExercises(
      fetchedData.exercises.map((exercise) => ({
        ...exercise,
      }))
    );
    setWorkoutDetails({
      workoutName: fetchedData.name,
      workoutCreator: fetchedData.user,
    });
  } catch (error) {
    console.error("couldnt get workout", error);
  }
};
