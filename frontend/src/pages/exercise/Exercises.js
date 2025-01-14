import { useEffect, useState } from "react";
import "./Exercises.css";
import axios from "axios";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import SearchList from "../../components/SearchList";

const backendURL = "http://localhost:3000";
const Excercises = ({ workoutId, onAddExercise }) => {
  const [data, setData] = useState([]);
  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const response = await axios.get("/api/admin/exercises");
        setData(response.data);
      } catch (err) {
        console.error("error", err);
      }
    };
    fetchExercises();
  }, []);

  return (
    <SearchList
      data={data}
      contentType={"Exercise"}
      workoutId={workoutId}
      onAddExercise={onAddExercise}
    />
  );
};
export default Excercises;
