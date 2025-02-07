import { useMutation } from "@tanstack/react-query";
import { updateExercise } from "../api/exerciseService";

export const useUpdateExercise = () => {
  return useMutation({
    mutationFn: updateExercise,
    onSuccess: (updatedExercise) => {},
    onError: (error) => {},
  });
};
