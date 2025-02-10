import { useQuery } from "@tanstack/react-query";
import { fetchExercises, Exercise } from "../../api/exerciseService.tsx";

export const useGetExercises = () => {
  return useQuery<Exercise, Error>({
    queryKey: ["exercises"],
    queryFn: fetchExercises,
  });
};
