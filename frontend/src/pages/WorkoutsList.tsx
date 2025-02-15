import React, { useState } from "react";
import SearchList from "../components/search/SearchList";
import SearchContainer from "../components/search/SearchContainer";

const ExcercisesList = ({ onAddExercise }) => {
  const [filteredData, setFilteredData] = useState([]);

  const handleFilteredDataChange = (data) => {
    setFilteredData(data);
  };

  return (
    <div className="grid grid-cols-1 grid-rows-[max-content] min-h-full w-full max-h-full gap-2">
      <SearchContainer
        contentType={"workouts"}
        onFilteredDataChange={handleFilteredDataChange}
      />
      <SearchList data={filteredData} onAddExercise={onAddExercise} />
    </div>
  );
};
export default ExcercisesList;
