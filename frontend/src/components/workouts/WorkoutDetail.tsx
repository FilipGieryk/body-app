import { useState } from "react";
import { Link, useParams } from "react-router-dom";
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
  const { exercises, setExercises, handleDeleteExercise } = useWorkout();

  // Start workout and move all exercises to context
  const handleStartWorkout = () => {
    if (data?.exercises) {
      const initialExercises = data.exercises.map((el) => ({
        ...el.exercise, // Copy exercise object
        sets: el.sets, // Include sets, repetitions, weight
        repetitions: el.repetitions,
        weight: el.weight,
      }));
      setExercises(initialExercises);
    }
    setIsEdit(true);
  };

  // Save changes to workout session
  const handleSaveChanges = () => {
    addSession({ workoutId, exercises });
    setIsEdit(false);
  };
  console.log(data);
  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="flex flex-col  h-full overflow-y-scroll">
      <h1 className="text-5xl mb-15">{data.workoutName}</h1>
      <p className="text-5xl mb-15">{data.workoutDetails}</p>
      <table className="text-2xl text-left">
        <tr>
          <th>Exercise</th>
          <th>sets</th>
          <th>reps</th>
          <th>weight</th>
        </tr>

        {!isEdit
          ? // When NOT editing, show exercises from workout data
            data.exercises.map((el, index) => (
              <tr
                key={index}
                onClick={() =>
                  window.open(
                    `/exercises/${el.exercise._id}`,
                    "_blank",
                    "noopener,noreferrer"
                  )
                }
                className="cursor-pointer hover:bg-gray-300  even:bg-gray-100 odd:bg-white"
                // className="flex items-center justify-around text-5xl rounded-4xl decoration-0 text-black w-[90%] h-40"
              >
                <td className="py-1 w-83">{el.exercise.name}</td>
                <td className="w-83">{el.sets}</td>
                <td className="w-83">{el.repetitions}</td>
                <td className="w-83">{el.weight}</td>
                {/* <p>{el.exercise.averageRating}</p> */}
              </tr>
            ))
          : // When editing, show exercises from context (modifiable)
            exercises.map((el, index) => (
              <tr
                key={index}
                className="even:bg-gray-100 odd:bg-white"
                // className="flex items-center justify-around text-5xl rounded-4xl decoration-0 text-black w-[90%] h-40"
              >
                <td>{el.name}</td>
                <td>
                  <input
                    type="number"
                    value={el.sets}
                    onChange={(e) =>
                      setInitialExercises((prev) =>
                        prev.map((ex) =>
                          ex._id === el._id
                            ? { ...ex, sets: e.target.value }
                            : ex
                        )
                      )
                    }
                  />
                </td>
                <td>
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
                </td>
                <td>
                  <input
                    type="number"
                    value={el.weight}
                    onChange={(e) =>
                      setInitialExercises((prev) =>
                        prev.map((ex) =>
                          ex._id === el._id
                            ? { ...ex, weight: e.target.value }
                            : ex
                        )
                      )
                    }
                  />
                </td>
                {/* <p>{el.averageRating}</p> */}
                <button
                  onClick={() => handleDeleteExercise(el._id)}
                  className="bg-red-500 px-3 py-1 rounded text-white"
                >
                  X
                </button>
              </tr>
            ))}
      </table>

      {isEdit ? (
        <>
          <div>
            <button
              onClick={handleSaveChanges}
              className="mt-4 bg-green-500 px-4 py-2 rounded text-white w-50 "
            >
              Finish Workout
            </button>
          </div>
          <ExercisesList workoutId={workoutId} />
        </>
      ) : (
        <div>
          <button
            onClick={handleStartWorkout}
            className="mt-4 bg-blue-500 px-4 py-2 rounded text-white w-50"
          >
            Start Workout
          </button>
        </div>
      )}
    </div>
  );
};

export default WorkoutDetail;
