import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

type SearchBarProps = {
  searchQuery: any;
  changeSearchQuery: any;
};

const SearchBar = ({ searchQuery, changeSearchQuery }: SearchBarProps) => {
  return (
    <div className="shadow-lg rounded-2xl flex items-center justify-center">
      <input
        className="text-3xl p-4 outline-0"
        value={searchQuery}
        onChange={changeSearchQuery}
        placeholder="search"
      ></input>
      <FontAwesomeIcon className="text-xl p-3" icon={faMagnifyingGlass} />
    </div>
  );
};
export default SearchBar;
