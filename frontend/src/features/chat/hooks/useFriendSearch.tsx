import { ChangeEvent, useEffect, useState } from "react";
// import { User } from "../../../context/UserContext";
import { useDebounce } from "use-debounce";

export const useFriendSearch = (friends) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedTerm] = useDebounce(searchTerm, 400);
  const [filteredFriends, setFilteredFriends] = useState([]);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (debouncedTerm.trim() === "") {
      setFilteredFriends(friends);
    } else {
      const filtered = friends.filter((friend) =>
        friend.username.toLowerCase().includes(debouncedTerm.toLowerCase())
      );
      setFilteredFriends(filtered);
    }
  }, [debouncedTerm, friends]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setShowResults(true);
  };

  const handleInputClick = () => {
    setFilteredFriends(friends);
    setShowResults(true);
  };

  return {
    searchTerm,
    filteredFriends,
    handleInputChange,
    handleInputClick,
    setSearchTerm,
    setFilteredFriends,
    showResults,
    setShowResults,
  };
};
