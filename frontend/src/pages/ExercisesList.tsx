import React, { useState } from "react";
import SearchList from "../components/search/SearchList";
import SearchContainer from "../components/search/SearchContainer";

const ExercisesList = () => {
  const [filteredData, setFilteredData] = useState([]);

  const handleFilteredDataChange = (data) => {
    setFilteredData(data);
  };
  return (
    <div className="grid grid-cols-1 grid-rows-[max-content] min-h-full w-full max-h-full gap-2">
      <SearchContainer
        contentType={"exercises"}
        onFilteredDataChange={handleFilteredDataChange}
      />
      <SearchList data={filteredData} contentType={"exercises"} />
    </div>
  );
};
export default ExercisesList;
