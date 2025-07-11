import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createOrGetChat } from "../../../api/chatService";
export const useCreateOrGetChat = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createOrGetChat,
    onSuccess: (data, variables) => {
      console.log(data);
      console.log(variables);
      // queryClient.setQueryData(["chat", variables.userId], data);
    },
    onError: (error) => {
      console.error("error creating/getting chat", error);
    },
  });
};
