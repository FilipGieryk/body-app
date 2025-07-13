import CheckboxList from "./components/CheckboxList";
import Sorting from "./components/Sorting";
import SearchBar from "./components/SearchBar";
import React, { useEffect, useState } from "react";
import { useSearchBar } from "./hooks/useSearchBar";
import { useBodyPartSelection } from "../exercise/hooks/useBodyPartSelection";
import { useSorting } from "./hooks/useSorting";

type SearchContainerProps = {
  data: any;
  onFilteredDataChange: any;
};

const SearchContainer = ({
  data,
  onFilteredDataChange,
}: SearchContainerProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
      <div className="hidden md:flex gap-4">
        <Sorting sortOrder={sortOrder} toggleSortOrder={toggleSortOrder} />
        <CheckboxList
          handleBodyPartChange={handleBodyPartChange}
          selectedBodyParts={selectedBodyParts}
        />
      </div>

      {/* Mobile layout: Toggle Button */}
      <div className="md:hidden mt-4 w-full flex justify-center">
        <button
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          className="px-4 py-2 bg-black text-white rounded-md"
        >
          {mobileMenuOpen ? "Hide Filters" : "Show Filters"}
        </button>
      </div>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-4 w-full flex flex-col items-center gap-4">
          <Sorting sortOrder={sortOrder} toggleSortOrder={toggleSortOrder} />
          <CheckboxList
            handleBodyPartChange={handleBodyPartChange}
            selectedBodyParts={selectedBodyParts}
          />
        </div>
      )}
    </div>
  );
};
export default SearchContainer;
