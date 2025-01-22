import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import "./SearchInput.css";
import { useState } from "react";
import CheckboxList from "./CheckboxList";

const SearchInput = ({
  searchQuery,
  changeSearchQuery,
  toggleSortOrder,
  handleBodyPartChange,
  selectedBodyParts,
  sortOrder,
}) => {
  return (
    <div className="search-container-search">
      <button onClick={() => toggleSortOrder("name")}>
        name({sortOrder.order === "asc" ? "A-Z" : "Z-A"})
      </button>
      <button onClick={() => toggleSortOrder("averageRating")}>
        rating({sortOrder.order === "asc" ? "A-Z" : "Z-A"})
      </button>
      <div className="exercises-search">
        <input
          className="exercises-search-input"
          value={searchQuery}
          onChange={changeSearchQuery}
          placeholder="search"
        ></input>
        <FontAwesomeIcon className="search-icon" icon={faMagnifyingGlass} />
      </div>
      {/* // <SearchInput */}
      {/* //   searchQuery={searchQuery} */}
      {/* //   changeSearchQuery={changeSearchQuery} */}
      {/* // /> */}
      <CheckboxList
        handleBodyPartChange={handleBodyPartChange}
        selectedBodyParts={selectedBodyParts}
      />
    </div>
  );
};
export default SearchInput;
