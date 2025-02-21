import { createContext, useContext, useState } from "react";

const WorkoutContext = createContext();

export const WorkoutProvider = ({ children }) => {
  const [exercises, setExercises] = useState([]);

  const setInitialExercises = (initialExercises) => {
    setExercises(initialExercises);
  };

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

  return (
    <WorkoutContext.Provider
      value={{
        exercises,
        setInitialExercises,
        handleAddExercise,
        handleDeleteExercise,
      }}
    >
      {children}
    </WorkoutContext.Provider>
  );
};

export const useWorkout = () => useContext(WorkoutContext);
