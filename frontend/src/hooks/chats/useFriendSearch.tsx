import { ChangeEvent, useEffect, useState } from "react";
import { User } from "../../../../shared/types/types";
export const useFriendSearch = (friends: User[]) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredFriends, setFilteredFriends] = useState<User[]>([]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);

    if (searchTerm.trim() === "") {
      setFilteredFriends(friends);
    } else {
      const filtered = friends.filter((friend) =>
        friend.username.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredFriends(filtered);
    }
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
