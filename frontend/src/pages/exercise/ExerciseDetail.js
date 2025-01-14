import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
const ExerciseDetail = () => {
  const [exercise, setExercise] = useState("");
  const { exerciseId } = useParams();
  useEffect(() => {
    const fetchExercise = async () => {
      try {
        const response = await axios.get(`/api/admin/exercises/${exerciseId}`);
        setExercise(response.data);
      } catch (error) {
        console.error("failed to fetch exercise", error);
      }
    };
    fetchExercise();
  }, []);
  return (
    <div className="outer-box">
      <div>{exercise.name}</div>
      {/* <div>{exercise.bodyPart}</div> */}
      <div>{exercise.media}</div>
    </div>
  );
};

export default ExerciseDetail;
