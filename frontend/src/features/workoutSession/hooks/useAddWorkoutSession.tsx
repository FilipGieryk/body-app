import { useMutation } from "@tanstack/react-query";
import { addWorkoutSessions } from "../../../api/workoutSessionsService";

export const useAddWorkoutSession = () => {
  return useMutation({
    mutationFn: addWorkoutSessions,
    onSuccess: (data) => {
      console.log("Workout session created successfully!", data);
    },
    onError: (error) => {
      console.error("Error creating workout session", error);
    },
  });
};
