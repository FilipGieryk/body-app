import React from "react";
import SearchList from "../components/search/SearchList";
import { useGetExercises } from "../hooks/exercises/useGetExercises";

const backendURL = "http://localhost:3000";
const ExcercisesList = ({ workoutId, onAddExercise }) => {
  const { data, isLoading, isError, error } = useGetExercises();
  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>error occured {error.message}</p>;

  return (
    <SearchList
      content={data}
      contentType={"Exercise"}
      workoutId={workoutId}
      onAddExercise={onAddExercise}
    />
  );
};
export default ExcercisesList;
