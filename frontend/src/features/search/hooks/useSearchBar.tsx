import { useState, useMemo } from "react";
import { useDebounce } from "use-debounce";

export const useSearchBar = (content, selectedBodyParts) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQueryValue] = useDebounce(searchQuery, 300);

  const changeSearchQuery = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const filteredContent = useMemo(() => {
    return content?.filter((item) => {
      const isWorkout = item.exercises && Array.isArray(item.exercises);
      const matchesSearchQuery = item.name
        .toLowerCase()
        .includes(debouncedSearchQueryValue);

      let matchesBodyPart = false;

      if (selectedBodyParts.length === 0) {
        matchesBodyPart = true;
      } else {
        if (isWorkout) {
          matchesBodyPart = item.exercises.some((exercise) => {
            const nestedExercise = exercise.exercise;
            return (
              nestedExercise &&
              nestedExercise.bodyPart &&
              nestedExercise.bodyPart.some((part) =>
                selectedBodyParts.includes(part)
              )
            );
          });
        } else {
          matchesBodyPart =
            item.bodyPart &&
            item.bodyPart.some((part) => selectedBodyParts.includes(part));
        }
      }

      return matchesSearchQuery && matchesBodyPart;
    });
  }, [content, debouncedSearchQueryValue, selectedBodyParts]);

  return { debouncedSearchQueryValue, changeSearchQuery, filteredContent };
};
