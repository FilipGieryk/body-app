import Thumbnail from "../thumbnail/Thumbnail.jsx";
import React from "react";

const SearchList = ({ data, contentType, onAddExercise }) => {
  return (
    <div className="grid grid-cols-3 overflow-y-scroll min-h-full max-h-full h-100 gap-x-20 justify-items-center px-10 pt-10 gap-y-10">
      {data.map((el, index) => (
        <Thumbnail
          className="h-fit w-100"
          data={el}
          link={`/${contentType}/${el._id}`}
          showButton={contentType === "exercises"}
          onAddExercise={onAddExercise}
        />
      ))}
    </div>
  );
};

export default SearchList;
