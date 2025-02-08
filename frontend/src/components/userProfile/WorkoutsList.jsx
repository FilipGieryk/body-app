import { Link } from "react-router-dom";
import { useState } from "react";
const WokroutsList = ({ userInfo }) => {
  return (
    <div className="flex flex-row w-[90%] h-[90%] flex-wrap content-start gap-4">
      {userInfo.workouts.map((el) => (
        <Link
          className="min-w-60 h-20 rounded-4xl text-2xl"
          to={`/workouts/${el._id}`}
        >
          {el.name}
        </Link>
      ))}
      <Link
        to={"/workout/create"}
        className="min-w-60 h-20 rounded-4xl text-2xl"
      >
        +
      </Link>
    </div>
  );
};

export default WokroutsList;
