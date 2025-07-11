import { useQuery } from "@tanstack/react-query";
import { fetchExercises } from "../../features/exercise/api/exerciseService.tsx";
import { fetchWorkouts } from "../../features/workout/api/workoutService.tsx";

export const useFetchData = (contentType) => {
  const fetchData = async () => {
    if (contentType === "workouts") {
      return await fetchWorkouts();
    } else if (contentType === "exercises") {
      return await fetchExercises();
    }
    throw new Error("invalid content type");
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["data", contentType],
    queryFn: fetchData,
  });
  return { data, isLoading, error };
};
