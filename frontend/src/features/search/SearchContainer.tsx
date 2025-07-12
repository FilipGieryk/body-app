import CheckboxList from "./components/CheckboxList";
import Sorting from "./components/Sorting";
import SearchBar from "./components/SearchBar";
import React, { useEffect } from "react";
import { useSearchBar } from "../../hooks/useSearchBar";
import { useBodyPartSelection } from "../exercise/hooks/useBodyPartSelection";
import { useSorting } from "../../hooks/useSorting";

const SearchContainer = ({ data, onFilteredDataChange }) => {
  const { selectedBodyParts, handleBodyPartChange } = useBodyPartSelection();

  const { searchQuery, changeSearchQuery, filteredContent } = useSearchBar(
    data,
    selectedBodyParts
  );

  const { sortOrder, toggleSortOrder, sortData } = useSorting();

  useEffect(() => {
    if (filteredContent) {
      const sortedFilteredData = sortData(filteredContent);
      onFilteredDataChange(sortedFilteredData);
    }
  }, [filteredContent, sortOrder]);

  return (
    <div className="flex items-center justify-around py-5">
      <SearchBar
        searchQuery={searchQuery}
        changeSearchQuery={changeSearchQuery}
      />
      <Sorting sortOrder={sortOrder} toggleSortOrder={toggleSortOrder} />
      <CheckboxList
        handleBodyPartChange={handleBodyPartChange}
        selectedBodyParts={selectedBodyParts}
      />
    </div>
  );
};
export default SearchContainer;
