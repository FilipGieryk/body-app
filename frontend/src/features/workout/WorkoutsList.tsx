import React, { useState } from "react";
import SearchList from "../search/components/SearchList";
import SearchContainer from "../search/SearchContainer";
import { useFetchData } from "../../shared/hooks/useFetchData";

const WorkoutsList = () => {
  const [filteredData, setFilteredData] = useState([]);
  const { data, isLoading, error } = useFetchData("workouts");

  const handleFilteredDataChange = (data) => {
    setFilteredData(data);
  };
  if (isLoading) return <p> loading...</p>;
  if (error) return <p> error</p>;
  return (
    <div className="grid grid-cols-1 grid-rows-[max-content] min-h-full w-full max-h-full gap-2">
      <SearchContainer
        data={data}
        onFilteredDataChange={handleFilteredDataChange}
      />
      <SearchList data={filteredData} contentType={"workouts"} />
    </div>
  );
};

export default WorkoutsList;
