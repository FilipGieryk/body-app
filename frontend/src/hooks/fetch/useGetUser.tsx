import { useQuery } from "@tanstack/react-query";
import { getUserById, User } from "../../api/usersService";

export const useGetUser = (id: string) => {
  return useQuery<User, Error>({
    queryKey: ["user", id],
    queryFn: () => getUserById(id),
  });
};
