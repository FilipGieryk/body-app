import { useEffect, useState } from "react";
import "./ExercisesList.css";
import axios from "axios";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import SearchList from "../../components/Other/SearchList";

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
