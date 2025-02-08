import { useEffect, useState } from "react";
import axios from "axios";
import SearchList from "../components/search/SearchList";

const backendURL = "http://localhost:3000";
const ExcercisesList = ({ workoutId, onAddExercise }) => {
  const [content, setContent] = useState([]);
  useEffect(() => {
    const fetchExercises = async () => {
      try {
        console.log("fetching");
        const response = await axios.get("/api/admin/exercises");
        setContent(response.data);
        console.log(response);
      } catch (err) {
        console.error("error", err);
      }
    };
    fetchExercises();
  }, []);

  return (
    <SearchList
      content={content}
      contentType={"Exercise"}
      workoutId={workoutId}
      onAddExercise={onAddExercise}
    />
  );
};
export default ExcercisesList;
