import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import ExercisesList from "../../pages/exercise/ExercisesList";
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

  const handleSaveChanges = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        "/api/workouts/create",
        {
          name,
          description,
          exercises,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Workout added successfully:", response.data);
    } catch (error) {
      console.error("Error adding workout:", error);
    }
  };

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
    <div className="flex justify-center flex-col items-center">
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
      <button onClick={handleSaveChanges}>Finish Workout</button>
      <ExercisesList onAddExercise={handleAddExercise} />
    </div>
  );
};

export default CreateWorkout;
