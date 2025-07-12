import { useMutation, useQuery } from "@tanstack/react-query";
import { fetchWorkouts } from "../api/workoutService";

export const useHelpWorkouts = (workoutIds: string[]) =>
  useQuery({
    queryKey: ["exampleWorkouts", workoutIds],
    queryFn: () => fetchWorkouts(workoutIds),
    enabled: Array.isArray(workoutIds) && workoutIds.length > 0,
  });
