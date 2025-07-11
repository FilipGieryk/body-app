import { useQuery } from "@tanstack/react-query";
import { fetchUserInfo } from "../../features/profile/api/usersService";

export const useLoggedUserInfo = (enabled = true) => {
  return useQuery({
    queryKey: ["loggedUserInfo"],
    queryFn: fetchUserInfo,
    staleTime: 1000 * 60 * 5,
    enabled,
  });
};
