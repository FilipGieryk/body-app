import { ChangeEvent, useEffect, useState } from "react";
import { User } from "../../../../shared/types/types";
import { useDebounce } from "use-debounce";

export const useFriendSearch = (friends: User[]) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedTerm] = useDebounce(searchTerm, 400);
  const [filteredFriends, setFilteredFriends] = useState<User[]>([]);

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
  };

  const handleInputClick = () => {
    setFilteredFriends(friends);
  };

  return {
    searchTerm,
    filteredFriends,
    handleInputChange,
    handleInputClick,
    setSearchTerm,
    setFilteredFriends,
  };
};
