import { Link } from "react-router-dom";
import "./WorkoutsList.css";
import { useState } from "react";
const WokroutsList = ({ userInfo }) => {
  const [hoveredWorkout, setHoveredWorkout] = useState(null);

  const handleMouseEnter = (workout) => {
    setHoveredWorkout(workout);
  };

  const handleMouseLeave = () => {
    setHoveredWorkout(null);
  };

  return (
    <div className="profile-workouts-container">
      {userInfo.workouts.map((el) => (
        <Link className="profile-workouts-element" to={`/workouts/${el._id}`}>
          {el.name}
        </Link>
      ))}
      <Link to={"/workout/create"} className="profile-workouts-element">
        +
      </Link>
    </div>
  );
};

export default WokroutsList;
