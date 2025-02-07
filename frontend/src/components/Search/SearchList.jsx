import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Rating from "../Other/Rating";
import SearchInput from "./SearchInput";
import "./SearchList.css";
import CreateWorkout from "../Create/CreateWorkout";
import { useLocation } from "react-router-dom";
import Thumbnail from "../Thumbnail/Thumbnail";
const backendURL = "http://localhost:3000";

const SearchList = ({ content, contentType, onAddExercise }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBodyParts, setSelectedBodyParts] = useState([]);
  const [sortOrder, setSortOrder] = useState({
    orderItem: "averageRating",
    order: "desc",
  });
  const navigate = useNavigate();
  const location = useLocation();
  const [userId, setUserId] = useState("");
  const token = localStorage.getItem("token");
  const [hoveredIndex, setHoveredIndex] = useState(null);

  useEffect(() => {
    if (token) {
      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      setUserId(decodedToken.id);
    }
  }, []);

  const toggleSortOrder = (orderItem) => {
    setSortOrder((prevOrder) => ({
      ...prevOrder,
      order:
        prevOrder.orderItem === orderItem
          ? prevOrder.order === "asc"
            ? "desc"
            : "asc"
          : "asc",
      orderItem: orderItem,
    }));
  };

  const handleBodyPartChange = (bodyPart) => {
    if (selectedBodyParts.includes(bodyPart)) {
      setSelectedBodyParts(
        selectedBodyParts.filter((part) => part !== bodyPart)
      );
    } else {
      setSelectedBodyParts([...selectedBodyParts, bodyPart]);
    }
  };

  const changeSearchQuery = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };
  const filteredContent = content?.filter((item) => {
    const isWorkout = item.exercises && Array.isArray(item.exercises);
    const matchesSearchQuery = item.name.toLowerCase().includes(searchQuery);

    let matchesBodyPart = false;

    if (selectedBodyParts.length === 0) {
      matchesBodyPart = true;
    } else {
      if (isWorkout) {
        matchesBodyPart = item.exercises.some((exercise) => {
          const nestedExercise = exercise.exercise;
          return (
            nestedExercise &&
            nestedExercise.bodyPart &&
            nestedExercise.bodyPart.some((part) =>
              selectedBodyParts.includes(part)
            )
          );
        });
      } else {
        // Check body parts for an individual exercise
        matchesBodyPart =
          item.bodyPart &&
          item.bodyPart.some((part) => selectedBodyParts.includes(part));
      }
    }

    return matchesSearchQuery && matchesBodyPart;
  });

  const sortedExercises = [...filteredContent].sort((a, b) => {
    const valA = a[sortOrder.orderItem];
    const valB = b[sortOrder.orderItem];
    const direction = sortOrder.order === "asc" ? 1 : -1;

    if (typeof valA === "string" && typeof valB === "string") {
      return direction * valA.localeCompare(valB);
    } else {
      return direction * (valA - valB);
    }
  });

  const handleAddElement = (addEl) => {
    if (location.pathname === "/exercises") {
      navigate("/workout/create", { state: { addedExercise: addEl } });
    } else {
      onAddExercise(addEl);
    }
  };

  return (
    <div className="grid grid-cols-1 grid-rows-[max-content] min-h-full w-full max-h-full gap-2 overflow-hidden ">
      <SearchInput
        searchQuery={searchQuery}
        changeSearchQuery={changeSearchQuery}
        toggleSortOrder={toggleSortOrder}
        handleBodyPartChange={handleBodyPartChange}
        selectedBodyParts={selectedBodyParts}
        sortOrder={sortOrder}
      />
      <div className="grid grid-cols-3 overflow-y-scroll min-h-full max-h-full h-100 gap-x-20 justify-items-center px-10 pt-10">
        {sortedExercises.map((el, index) => (
          <Thumbnail className="h-90 w-100" data={el} />
        ))}
      </div>
    </div>
  );
};

export default SearchList;
