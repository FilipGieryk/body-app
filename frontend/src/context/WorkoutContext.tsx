import { createContext, useContext, useMemo, useState } from "react";

const WorkoutContext = createContext();

export const WorkoutProvider = ({ children }) => {
  const [exercises, setExercises] = useState([]);

  const handleAddExercise = (exercise) => {
    setExercises((prev) => {
      if (!prev.some((ex) => ex._id === exercise._id)) {
        return [...prev, exercise];
      }
      return prev;
    });
  };
  const handleDeleteExercise = (exerciseId) => {
    setExercises((prev) => prev.filter((ex) => ex._id !== exerciseId));
  };

  const value = useMemo(
    () => ({
      exercises,
      setExercises,
      handleAddExercise,
      handleDeleteExercise,
    }),
    [exercises, setExercises, handleAddExercise, handleDeleteExercise]
  );
  return (
    <WorkoutContext.Provider value={value}>{children}</WorkoutContext.Provider>
  );
};

export const useWorkout = () => useContext(WorkoutContext);
