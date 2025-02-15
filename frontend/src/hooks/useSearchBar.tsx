import { useState, useMemo } from "react";

export const useSearchBar = (content, selectedBodyParts) => {
  const [searchQuery, setSearchQuery] = useState("");

  const changeSearchQuery = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const filteredContent = useMemo(() => {
    return content?.filter((item) => {
      const isWorkout = item.exercises && Array.isArray(item.exercises);
      const matchesSearchQuery = item.name.toLowerCase().includes(searchQuery);

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
  }, [content, searchQuery, selectedBodyParts]);

  return { searchQuery, changeSearchQuery, filteredContent };
};
