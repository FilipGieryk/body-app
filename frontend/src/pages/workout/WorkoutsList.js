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
  // const [workouts, setWorkouts] = useState([]);

  // useEffect(() => {
  //   const fetchWorkouts = async () => {
  //     try {
  //       const response = await axios.get("/api/workouts");
  //       setWorkouts(response.data);
  //     } catch (error) {
  //       console.log("error occured while fetching workouts", error);
  //     }
  //   };
  //   fetchWorkouts();
  // }, []);

  // return (
  //   <div className="exercises-container">
  //     <div className="exercises-search">SearchLIst</div>
  //     <div className="exercises-list">
  //       {workouts.map((el) => (
  //         <div>
  //           <Link to={`${el._id}`}>{el.name}</Link>
  //           {el.name} {el.createdAt}
  //           <Rating
  //             workoutId={el._id}
  //             userId={el.user}
  //             averageRating={el.averageRating}
  //           ></Rating>
  //         </div>
  //       ))}
  //     </div>
  //   </div>
  // );
  return <SearchList data={data} contentType={"Workout"} />;
};

export default WorkoutsList;
