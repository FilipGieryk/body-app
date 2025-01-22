import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./WorkoutDetail.css";
import { Link } from "react-router-dom";
import ExercisesList from "../../pages/exercise/ExercisesList";

const WorkoutDetail = () => {
  const { workoutId } = useParams();
  const [modifiedExercises, setModifiedExercises] = useState([]);
  const [workoutDetails, setWorkoutDetails] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [workoutSession, setWorkoutSession] = useState(null);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      setUserId(decodedToken.id);
    }
    const fetchWorkout = async () => {
      try {
        const response = await axios.get(`/api/workouts/${workoutId}`);
        const fetchedData = response.data;
        setModifiedExercises(
          fetchedData.exercises.map((exercise) => ({
            ...exercise,
          }))
        );
        setWorkoutDetails({
          workoutName: fetchedData.name,
          workoutCreator: fetchedData.user,
        });
      } catch (error) {
        console.error("couldnt get workout", error);
      }
    };
    fetchWorkout();
  }, []);

  const handleSaveChanges = async () => {
    try {
      const response = await axios.post(
        "/api/workout-sessions/add",
        {
          workoutId,
          modifiedExercises,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
    } catch (error) {
      console.error(error);
    }
  };
  const handleInputClick = (event) => {
    event.stopPropagation(); // Prevents the event from propagating to the anchor
    event.preventDefault(); // Prevents the anchor's default redirection behavior
  };

  const handleDeleteElement = (elToRemove) => {
    setModifiedExercises((prevExercises) =>
      prevExercises.filter((el) => el != elToRemove)
    );
  };

  const handleAddExercise = (newElement) => {
    setModifiedExercises((prevElements) => [
      ...prevElements,
      { exercise: newElement },
    ]);
  };

  return (
    <div className="workout-detail-container">
      <h1 className="workout-detail-name">{workoutDetails.name}</h1>

      {modifiedExercises.map((el, index) => (
        <Link
          className="workout-detail-element"
          to={`/exercises/${el.exercise._id}`}
        >
          {/* <h2>{el.exercise}</h2> */}
          {/* {el.exercise.bodyPart.map((part) => (
            <p>{part}</p>
          ))} */}

          {!isEdit ? (
            <>
              <p>{el.sets}</p>
              <p>{el.repetitions}</p>
              <p>{el.weight}</p>
            </>
          ) : (
            <>
              <input
                value={el.sets}
                onClick={handleInputClick}
                onChange={(e) =>
                  setModifiedExercises((prev) =>
                    prev.map((exercise, idx) =>
                      idx === index
                        ? { ...exercise, sets: e.target.value }
                        : exercise
                    )
                  )
                }
              />
              <input
                value={el.repetitions}
                onClick={handleInputClick}
                onChange={(e) =>
                  setModifiedExercises((prev) =>
                    prev.map((exercise, idx) =>
                      idx === index
                        ? { ...exercise, repetitions: e.target.value }
                        : exercise
                    )
                  )
                }
              />
              <input
                value={el.weight}
                onClick={handleInputClick}
                onChange={(e) =>
                  setModifiedExercises((prev) =>
                    prev.map((exercise, idx) =>
                      idx === index
                        ? { ...exercise, weight: e.target.value }
                        : exercise
                    )
                  )
                }
              />
            </>
          )}

          <p>{el.exercise.averageRating}</p>
          {isEdit && (
            <button
              onClick={(event) => {
                event.preventDefault();
                handleDeleteElement(el);
              }}
            >
              X
            </button>
          )}
        </Link>
      ))}
      {isEdit ? (
        <>
          <button onClick={handleSaveChanges}>finish workout</button>
          <ExercisesList
            workoutId={workoutId}
            onAddExercise={handleAddExercise}
          />
        </>
      ) : (
        <button onClick={() => setIsEdit(!isEdit)}>start workout</button>
      )}
    </div>
  );
};

export default WorkoutDetail;
