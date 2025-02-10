import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";

import { useCreateWorkout } from "../../hooks/workouts/useCreateWorkout";
const CreateWorkout = () => {
  const location = useLocation();
  const addedExercise = location.state?.addedExercise || null;
  const [name, setName] = useState("workout");
  const [description, setDescription] = useState("description");
  const [exercises, setExercises] = useState(
    addedExercise
      ? [{ ...addedExercise, sets: 0, repetitions: 0, weight: 0 }]
      : []
  );

  const token = localStorage.getItem("token");

  const { mutate, isError, isSuccess, error } = useCreateWorkout();
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newWorkout = { name, description, exercises };
    mutate(newWorkout);
  };
  // fix
  const handleInputClick = (event) => {
    event.stopPropagation();
    event.preventDefault();
  };

  const handleDeleteElement = (elToRemove) => {
    setExercises((prevExercises) =>
      prevExercises.filter((exercise) => exercise !== elToRemove)
    );
  };

  const handleAddExercise = (newElement) => {
    setExercises((prevExercises) => [
      ...prevExercises,
      { ...newElement, sets: 0, repetitions: 0, weight: 0 },
    ]);
  };

  return (
    <form className="flex justify-center flex-col items-center">
      <h1 className="text-5xl mb-40">
        <input value={name} onChange={(e) => setName(e.target.value)} />
      </h1>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)} // Update description directly
      />
      {exercises.map((el, index) => (
        <Link
          className="flex items-center justify-around text-5xl rounded-4xl decoration-0 text-black w-[90%] h-40"
          to={`/exercises/${el._id}`}
          // key={el.exercise._id} // Ensure unique key for each element
        >
          <input
            value={el.sets}
            onClick={handleInputClick}
            onChange={(e) => {
              const updatedSets = e.target.value;
              setExercises((prevExercises) =>
                prevExercises.map((exercise, idx) =>
                  idx === index ? { ...exercise, sets: updatedSets } : exercise
                )
              );
            }}
          />
          <input
            value={el.repetitions}
            onClick={handleInputClick}
            onChange={(e) => {
              const updatedRepetitions = e.target.value;
              setExercises((prevExercises) =>
                prevExercises.map((exercise, idx) =>
                  idx === index
                    ? { ...exercise, repetitions: updatedRepetitions }
                    : exercise
                )
              );
            }}
          />
          <input
            value={el.weight}
            onClick={handleInputClick}
            onChange={(e) => {
              const updatedWeight = e.target.value;
              setExercises((prevExercises) =>
                prevExercises.map((exercise, idx) =>
                  idx === index
                    ? { ...exercise, weight: updatedWeight }
                    : exercise
                )
              );
            }}
          />
          <p>{el.averageRating}</p>
          <button
            onClick={(event) => {
              event.preventDefault();
              handleDeleteElement(el);
            }}
          >
            X
          </button>
        </Link>
      ))}
      <button onClick={handleSubmit}>Finish Workout</button>
      <ExercisesList onAddExercise={handleAddExercise} />
    </form>
  );
};

export default CreateWorkout;
