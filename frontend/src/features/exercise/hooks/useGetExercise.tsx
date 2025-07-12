import { useQuery } from "@tanstack/react-query";
import { fetchExerciseById } from "../api/exerciseService";

export const useGetExercise = (id: string) => {
  return useQuery({
    queryKey: ["exercise", id],
    queryFn: () => fetchExerciseById(id),
    enabled: !!id,
  });
};
