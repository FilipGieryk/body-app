import { useMutation, useQueryClient } from "@tanstack/react-query";
import { markMessagesAsRead } from "../api/chatService";

export const useMarkMessagesAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: markMessagesAsRead,
    onMutate: (chatId) => {
      const previousChats = queryClient.getQueryData(["chats"]);
      queryClient.setQueryData(["chats"], (oldData) => {
        if (!oldData || !oldData.pages) return oldData;

        let didChange = false;

        const newPages = oldData.pages.map((page) => {
          const updatedChats = page.chats.map((chat) => {
            if (chat.chatId !== chatId) return chat;
            if (!chat.hasUnread) return chat; // Only update if needed

            didChange = true;
            return { ...chat, hasUnread: false };
          });

          // Only return a new page object if chats changed
          return page.chats === updatedChats
            ? page
            : { ...page, chats: updatedChats };
        });

        // Only return new data if something changed
        return didChange ? { ...oldData, pages: newPages } : oldData;
      });

      return { previousChats };
    },
    onError: (err, variables, context) => {
      if (context?.previousChats) {
        queryClient.setQueryData(["chats"], context.previousChats);
      }
    },
    onSettled: () => {
      // queryClient.invalidateQueries(["chats"]);
    },
  });
};
