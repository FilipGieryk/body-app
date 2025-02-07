import CheckboxList from "./CheckboxList";
import Sorting from "./Sorting";
import SearchBar from "./SearchBar";

const SearchInput = ({
  searchQuery,
  changeSearchQuery,
  toggleSortOrder,
  handleBodyPartChange,
  selectedBodyParts,
  sortOrder,
}) => {
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
export default SearchInput;
