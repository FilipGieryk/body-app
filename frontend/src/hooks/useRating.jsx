import { useMutation, useQuery } from "@tanstack/react-query";
import { submitRating } from "../api/ratingService.tsx";

export const useRating = (itemId) => {
  const mutation = useMutation({
    mutationFn: (newRating) => submitRating(itemId, newRating),
    onError: (error) => {
      console.error("Error submitting rating:", error);
    },
  });

  return {
    error: mutation.error,
    submitRating: mutation.mutate,
  };
};
