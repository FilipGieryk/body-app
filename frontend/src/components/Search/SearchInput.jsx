import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

import { useState } from "react";
import CheckboxList from "./CheckboxList";
import Sorting from "./Sorting";

const SearchInput = ({
  searchQuery,
  changeSearchQuery,
  toggleSortOrder,
  handleBodyPartChange,
  selectedBodyParts,
  sortOrder,
}) => {
  return (
    <div className="flex items-center justify-around">
      <div className="shadow-lg rounded-2xl flex items-center justify-center">
        <input
          className="text-3xl p-4 outline-0"
          value={searchQuery}
          onChange={changeSearchQuery}
          placeholder="search"
        ></input>
        <FontAwesomeIcon className="text-xl p-3" icon={faMagnifyingGlass} />
      </div>
      <Sorting sortOrder={sortOrder} toggleSortOrder={toggleSortOrder} />
      <CheckboxList
        handleBodyPartChange={handleBodyPartChange}
        selectedBodyParts={selectedBodyParts}
      />
    </div>
  );
};
export default SearchInput;
