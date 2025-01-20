import { useEffect, useState } from "react";
import "./WorkoutsList.css";
import axios from "axios";
import { Link } from "react-router-dom";
import Rating from "../../components/Rating";
import SearchList from "../../components/SearchList";

const WorkoutsList = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const response = await axios.get(`/api/workouts`);
        setData(response.data);
      } catch (err) {
        console.error("error", err);
      }
    };
    fetchExercises();
  }, []);

  return <SearchList data={data} contentType={"Workout"} />;
};

export default WorkoutsList;
