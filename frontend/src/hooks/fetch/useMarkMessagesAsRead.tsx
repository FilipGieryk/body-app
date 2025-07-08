import { useMutation, useQueryClient } from "@tanstack/react-query";
import { markMessagesAsRead } from "../../api/chatService";

export const useMarkMessagesAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: markMessagesAsRead,
    onMutate: (chatId) => {
      const previousChats = queryClient.getQueryData(["chats"]);
      queryClient.setQueryData(["chats"], (oldChats) =>
        oldChats.map((chat) =>
          chat.chatId === chatId ? { ...chat, hasUnread: false } : chat
        )
      );

      return { previousChats };
    },
    onError: (err, variables, context) => {
      if (context?.previousChats) {
        queryClient.setQueryData(["chats"], context.previousChats);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries(["chats"]);
    },
  });
};
