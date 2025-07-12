import { useQuery } from "@tanstack/react-query";

import { fetchWorkoutById } from "../api/workoutService";

export const useGetWorkout = (id: string) => {
  return useQuery({
    queryKey: ["workout", id],
    queryFn: () => fetchWorkoutById(id),
    enabled: !!id,
  });
};
