import { useMutation } from "@tanstack/react-query";
import { createOrGetChat } from "../../../api/chatService";
export const useCreateOrGetChat = () => {
  return useMutation({
    mutationFn: createOrGetChat,
    onSuccess: (data) => {
      console.log("fsdf", data);
    },
    onError: (error) => {
      console.error("error creating/getting chat", error);
    },
  });
};
