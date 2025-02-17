import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUser } from "../../api/usersService";
import { User } from "../../../../shared/types/types";

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ updatedFields }: { updatedFields: Partial<User> }) =>
      updateUser(updatedFields),
    onSuccess: (data) => {
      queryClient.invalidateQueries(["user", data.id]);
      queryClient.setQueryData(["user", data.id], data);
    },
    onError: (error) => {
      console.error("Updating user error", error);
    },
  });
};
