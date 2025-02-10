import { useQuery } from "@tanstack/react-query";
import { fetchWorkouts, Workout } from "../../api/workoutService";

export const useGetWorkouts = () => {
  return useQuery<Workout[], Error>({
    queryKey: ["workouts"],
    queryFn: fetchWorkouts,
  });
};
