import { useEffect, useState } from "react";
import "./Workouts.css";
import axios from "axios";
import { useParams } from "react-router-dom";
const Workouts = () => {
  // get exercises
  const [exercises, setExercises] = useState([]);
  const [workout, setWorkout] = useState({
    name: "workout",
    description: "description",
    exercises: [],
  });
  const [currentExercise, setCurrentExercise] = useState({
    exercise: "",
    name: "",
    sets: 0,
    repetitions: 0,
    weight: 0,
  });
  const [userId, setUserId] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      setUserId(decodedToken.id);
    }
    const fetchExercises = async () => {
      try {
        const response = await axios.get("/api/admin/exercises");
        setExercises(response.data);
      } catch (error) {
        console.error("Eror fetching exercises", error);
      }
    };
    fetchExercises();
  }, []);

  const addExerciseToWorkout = () => {
    if (currentExercise.exercise) {
      setWorkout((prevWorkout) => ({
        ...prevWorkout,
        exercises: [...prevWorkout.exercises, { ...currentExercise }],
      }));
      setCurrentExercise({
        exercise: "",
        name: "",
        sets: 0,
        repetitions: 0,
        weight: 0,
      });
    }
  };
  const deleteExercise = (index) => {
    setWorkout((prevWorkout) => ({
      ...prevWorkout,
      exercises: prevWorkout.exercises.filter((_, i) => i !== index),
    }));
  };

  const submitWorkout = (event) => {
    event.preventDefault();
    axios
      .post(`/api/workouts/${userId}/create`, { ...workout, userId })
      .then((response) => {
        console.log("workout added successfully:", response.data);
        setWorkout({ name: "dasd", exercises: [] });
      })
      .catch((error) => console.error("error adding wokrout:", error));
  };

  return (
    <div className="workout-container">
      <div className="workout-exercise-input">
        <form onSubmit={submitWorkout}>
          <select
            value={currentExercise.exercise}
            onChange={(e) => {
              const selectedValue = JSON.parse(e.target.value);
              setCurrentExercise((prevExercise) => ({
                ...prevExercise,
                exercise: selectedValue.id,
                name: selectedValue.name,
              }));
            }}
          >
            <option value="">Select an exercise</option>
            {exercises.map((el) => (
              <option
                key={el._id}
                value={JSON.stringify({ id: el._id, name: el.name })}
              >
                {el.name}
              </option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Sets"
            value={currentExercise.sets}
            onChange={(e) =>
              setCurrentExercise((prevExercise) => ({
                ...prevExercise,
                sets: Number(e.target.value),
              }))
            }
          />
          <input
            type="number"
            placeholder="Repetitions"
            value={currentExercise.repetitions}
            onChange={(e) =>
              setCurrentExercise((prevExercise) => ({
                ...prevExercise,
                repetitions: Number(e.target.value),
              }))
            }
          />
          <input
            type="number"
            placeholder="Weight"
            value={currentExercise.weight}
            onChange={(e) =>
              setCurrentExercise((prevExercise) => ({
                ...prevExercise,
                weight: Number(e.target.value),
              }))
            }
          />
          <button type="button" onClick={addExerciseToWorkout}>
            Add Exercise
          </button>

          <button type="submit">Submit Workout</button>
        </form>
      </div>
      <div className="workout-exercise-container">
        <input
          value={workout.name}
          onChange={(e) =>
            setWorkout((prevWorkout) => ({
              ...prevWorkout,
              name: e.target.value,
            }))
          }
        ></input>
        <input
          value={workout.description}
          onChange={(e) =>
            setWorkout((prevWorkout) => ({
              ...prevWorkout,
              description: e.target.value,
            }))
          }
        ></input>
        {workout.exercises.map((ex, index) => (
          <div className="workout-exercise-list" key={index}>
            Exercise ID: {ex.name}, Sets: {ex.sets}, Reps: {ex.repetitions},
            Weight: {ex.weight}
            <button
              className="delete-exercise-button"
              onClick={() => deleteExercise(index)}
            >
              X
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Workouts;
