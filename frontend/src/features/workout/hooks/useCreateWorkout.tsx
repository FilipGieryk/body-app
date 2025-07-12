import { useMutation } from "@tanstack/react-query";
import { createWorkout, Workout, NewWorkout } from "../api/workoutService";

export const useCreateWorkout = () => {
  return useMutation<Workout, Error, NewWorkout>({
    mutationFn: createWorkout,
    onSuccess: (data) => {
      console.log("Workout creEted", data);
    },
    onError: (error) => {
      console.error("error creating", error);
    },
  });
};
