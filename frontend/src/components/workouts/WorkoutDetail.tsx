import { useState } from "react";
import { useParams } from "react-router-dom";
import { useGetWorkout } from "../../hooks/workouts/useGetWorkout";
import ExercisesList from "../../pages/ExercisesList";
import { useAddWorkoutSession } from "../../hooks/workouts/useAddWorkoutSession";
import { useWorkout } from "../../context/WorkoutContext";

const WorkoutDetail = () => {
  const { workoutId } = useParams();
  if (!workoutId) return null;

  const [isEdit, setIsEdit] = useState(false);
  const { data, isLoading } = useGetWorkout(workoutId);
  const { mutate: addSession } = useAddWorkoutSession();
  const { exercises, setInitialExercises, handleDeleteExercise } = useWorkout();

  // Start workout and move all exercises to context
  const handleStartWorkout = () => {
    if (data?.exercises) {
      const initialExercises = data.exercises.map((el) => ({
        ...el.exercise, // Copy exercise object
        sets: el.sets, // Include sets, repetitions, weight
        repetitions: el.repetitions,
        weight: el.weight,
      }));
      setInitialExercises(initialExercises);
    }
    setIsEdit(true);
  };

  // Save changes to workout session
  const handleSaveChanges = () => {
    addSession({ workoutId, exercises });
    setIsEdit(false);
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="flex flex-col items-center h-full overflow-y-scroll">
      <h1 className="text-5xl mb-40">{data.workoutName}</h1>
      <p className="text-5xl mb-40">{data.workoutDetails}</p>

      {!isEdit
        ? // When NOT editing, show exercises from workout data
          data.exercises.map((el, index) => (
            <div
              key={index}
              className="flex items-center justify-around text-5xl rounded-4xl decoration-0 text-black w-[90%] h-40"
            >
              <p>{el.exercise.name}</p>
              <p>{el.sets}</p>
              <p>{el.repetitions}</p>
              <p>{el.weight}</p>
              <p>{el.exercise.averageRating}</p>
            </div>
          ))
        : // When editing, show exercises from context (modifiable)
          exercises.map((el, index) => (
            <div
              key={index}
              className="flex items-center justify-around text-5xl rounded-4xl decoration-0 text-black w-[90%] h-40"
            >
              <p>{el.name}</p>
              <input
                type="number"
                value={el.sets}
                onChange={(e) =>
                  setInitialExercises((prev) =>
                    prev.map((ex) =>
                      ex._id === el._id ? { ...ex, sets: e.target.value } : ex
                    )
                  )
                }
              />
              <input
                type="number"
                value={el.repetitions}
                onChange={(e) =>
                  setInitialExercises((prev) =>
                    prev.map((ex) =>
                      ex._id === el._id
                        ? { ...ex, repetitions: e.target.value }
                        : ex
                    )
                  )
                }
              />
              <input
                type="number"
                value={el.weight}
                onChange={(e) =>
                  setInitialExercises((prev) =>
                    prev.map((ex) =>
                      ex._id === el._id ? { ...ex, weight: e.target.value } : ex
                    )
                  )
                }
              />
              <p>{el.averageRating}</p>
              <button
                onClick={() => handleDeleteExercise(el._id)}
                className="bg-red-500 px-3 py-1 rounded text-white"
              >
                X
              </button>
            </div>
          ))}

      {isEdit ? (
        <>
          <button
            onClick={handleSaveChanges}
            className="mt-4 bg-green-500 px-4 py-2 rounded text-white"
          >
            Finish Workout
          </button>
          <ExercisesList workoutId={workoutId} />
        </>
      ) : (
        <button
          onClick={handleStartWorkout}
          className="mt-4 bg-blue-500 px-4 py-2 rounded text-white"
        >
          Start Workout
        </button>
      )}
    </div>
  );
};

export default WorkoutDetail;
