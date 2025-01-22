import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Rating from "./Rating";
import SearchInput from "./SearchInput";
import "./SearchList.css";
const backendURL = "http://localhost:3000";

const SearchList = ({ data, contentType, workoutId, onAddExercise }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBodyParts, setSelectedBodyParts] = useState([]);
  const [sortOrder, setSortOrder] = useState({
    orderItem: "averageRating",
    order: "desc",
  });
  const navigate = useNavigate();
  const [hoveredWorkout, setHoveredWorkout] = useState(null);
  const [userId, setUserId] = useState("");
  const token = localStorage.getItem("token");
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const [showBodyParts, setShowBodyParts] = useState(false);

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

  const filteredContent = data.filter((item) => {
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
    workoutId === undefined
      ? console.log("makenewworkut")
      : onAddExercise(addEl);
  };

  return (
    <div className="search-list-container">
      <SearchInput
        searchQuery={searchQuery}
        changeSearchQuery={changeSearchQuery}
        toggleSortOrder={toggleSortOrder}
        handleBodyPartChange={handleBodyPartChange}
        selectedBodyParts={selectedBodyParts}
        sortOrder={sortOrder}
      />
      <div className="search-list-elements-container">
        {sortedExercises.map((el, index) => (
          <div
            className="search-list-element"
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            style={{
              height: hoveredIndex === index ? "50rem" : "40rem",
              transition: "transform 0.3s ease",
              overflow: "hidden",

              marginBottom: hoveredIndex === index ? "-10rem" : "0",
              zIndex: hoveredIndex === index ? 10 : 1,
            }}
          >
            <Link className="search-list-element-info" to={el._id}>
              <img
                className="search-list-element-img"
                src={`${backendURL}/${el.media}`}
              />
              <div className="search-list-element-details">
                <div>
                  <h1>{el.name}</h1>
                  {contentType != "Workout" && (
                    <button
                      onClick={(event) => {
                        event.preventDefault();
                        handleAddElement(el);
                      }}
                    >
                      +
                    </button>
                  )}
                  {el.user && (
                    <a
                      href={`/profile/${el.user._id}`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {el.user.username}
                    </a>
                  )}
                </div>
                <div className="search-list-element-details-right">
                  <Rating
                    contentId={el._id}
                    userId={userId}
                    contentType={contentType}
                    averageRating={el.averageRating}
                  ></Rating>
                  <div key={index} className="bodyparts-list">
                    {el.bodyPart
                      .sort((a, b) => b.scale - a.scale)
                      .slice(0, hoveredIndex === index ? el.bodyPart.length : 2)
                      .map((bp) => (
                        <div
                          className={`bodypart-container ${
                            el.bodyPart.length === 1 ? "single-bodypart" : ""
                          }`}
                          style={{
                            backgroundColor: `rgb(${Math.min(
                              bp.scale * 2.55,
                              255
                            )}, 0, 0)`,
                          }}
                        >
                          {bp.part}
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchList;
