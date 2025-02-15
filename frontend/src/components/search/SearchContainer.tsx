import CheckboxList from "./CheckboxList";
import Sorting from "./Sorting";
import SearchBar from "./SearchBar";
import React, { useEffect } from "react";
import { useSearchBar } from "../../hooks/useSearchBar";
import { useFetchData } from "../../hooks/exercises/useFetchData";
import { useBodyPartSelection } from "../../hooks/useBodyPartSelection";
import { useSorting } from "../../hooks/useSorting";

const SearchContainer = ({ contentType, onFilteredDataChange }) => {
  const { data, isLoading, error } = useFetchData(contentType);
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

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading data: {error.message}</div>;

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
