import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Rating from "../thumbnail/Rating.jsx";
import SearchInput from "./SearchContainer.tsx";
import CreateWorkout from "../workouts/CreateWorkout.tsx";
import { useLocation } from "react-router-dom";
import Thumbnail from "../thumbnail/Thumbnail.jsx";
import React from "react";
const backendURL = "http://localhost:3000";

const SearchList = ({ data, onAddExercise }) => {
  // const { data, isLoading, error } = useFetchData(contentType);
  // const [selectedBodyParts] = useState([]);
  // const [sortOrder, setSortOrder] = useState({
  //   orderItem: "averageRating",
  //   order: "desc",
  // });
  // const navigate = useNavigate();
  // const location = useLocation();
  // const [userId, setUserId] = useState("");
  // const token = localStorage.getItem("token");
  // const [hoveredIndex, setHoveredIndex] = useState(null);

  // const handleAddElement = (addEl) => {
  //   if (location.pathname === "/exercises") {
  //     navigate("/workout/create", { state: { addedExercise: addEl } });
  //   } else {
  //     onAddExercise(addEl);
  //   }
  // };

  return (
    <div className="grid grid-cols-3 overflow-y-scroll min-h-full max-h-full h-100 gap-x-20 justify-items-center px-10 pt-10 gap-y-10">
      {data.map((el, index) => (
        <Thumbnail className="h-fit w-100" data={el} />
      ))}
    </div>
  );
};

export default SearchList;
