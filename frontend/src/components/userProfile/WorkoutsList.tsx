import { Link } from "react-router-dom";
import { useState } from "react";
import React from "react";
const WokroutsList = ({ userInfo }) => {
  return (
    <div className="flex flex-row w-[90%] h-[90%] flex-wrap content-start gap-4">
      <div className="bg-[url(./assets/brush-profile-horizontal.png)]  w-[55%] h-[60%] bg-[0%_-20%] bg-[length:110%_90%] absolute"></div>
      {userInfo.workouts.map((el) => (
        <Link
          className="h-20 rounded-4xl text-2xl relative mt-15"
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
