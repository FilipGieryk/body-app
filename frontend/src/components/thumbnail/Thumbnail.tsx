import React from "react";
import Rating from "./Rating";
import clsx from "clsx";
import { Link } from "react-router-dom";
import { useWorkout } from "../../context/WorkoutContext";
const Thumbnail = ({ data, className, link, showButton }) => {
  const { handleAddExercise } = useWorkout();
  return (
    <div className="relative">
      <Link to={link}>
        <div className="h-fit w-100 relative">
          <img
            src={data?.media}
            className="w-full h-[15rem] rounded-2xl overflow-visible bg-[url(./assets/bg-thumb.png)] bg-[length:100%_100%]"
          />
          <div className="grid grid-cols-2 grid-rows-2">
            <h2 className="mg-0 text-3xl truncate text-start">{data?.name}</h2>
            <Rating averageRating={data.averageRating} itemId={undefined} />
          </div>
          {/* <BodyParts /> */}
          {/* <Rating itemId={data._id} averageRating={data.averageRating} /> */}
          {/* <GlitchButton content={"ADD"} /> */}
        </div>
      </Link>
      {showButton && (
        <button
          className="absolute bottom-0  w-10 h-10 bg-green-300"
          onClick={() => handleAddExercise(data)}
        >
          +
        </button>
      )}
    </div>
  );
};
export default Thumbnail;
