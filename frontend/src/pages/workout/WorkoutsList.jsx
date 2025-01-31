import { useEffect, useState } from "react";

import axios from "axios";
import { Link } from "react-router-dom";
import Rating from "../../components/Other/Rating";
import SearchList from "../../components/Other/SearchList";

const WorkoutsList = () => {
  const [content, setContent] = useState([]);
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
  return <SearchList content={content} contentType={"Workout"} />;
};

export default WorkoutsList;
