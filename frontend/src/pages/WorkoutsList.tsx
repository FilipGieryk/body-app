import React from "react";
import SearchList from "../components/search/SearchList.jsx";
import { useGetWorkouts } from "../hooks/workouts/useGetWorkouts.tsx";

const WorkoutsList = () => {
  const { data, isLoading, isError, error } = useGetWorkouts();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error?.message}</div>;
  }

  console.log(data);
  return (
    <SearchList
      content={data}
      contentType={"Workout"}
      onAddExercise={undefined}
    />
  );
};

export default WorkoutsList;
