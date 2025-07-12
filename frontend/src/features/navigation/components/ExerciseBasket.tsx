import React from "react";
import { useWorkout } from "../../../context/WorkoutContext";

export const ExerciseBasket = () => {
  const { exercises, handleDeleteExercise } = useWorkout();

  return (
    <>
      {exercises.length > 0 && (
        <div className="w-80 h-120 absolute bg-gray-400 right-30 top-10 p-4 rounded">
          <p>Workout</p>

          {exercises.map((el) => (
            <div key={el._id} className="flex justify-between p-2 border-b">
              <span>{el.name}</span>
              <button
                className="text-red-600"
                onClick={() => handleDeleteExercise(el._id)}
              >
                X
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  );
};
