import { QueryClient } from "@tanstack/react-query";

export const updateMessagesAndChats = (
  queryClient: QueryClient,
  chatId: string,
  message
) => {
  queryClient.setQueryData(["messages", chatId], (oldMessages: any = []) => [
    ...oldMessages,
    message,
  ]);

  queryClient.setQueryData(["chats"], (oldChats: any[] = []) =>
    oldChats.map((chat) =>
      chat.chatId == chatId
        ? {
            ...chat,
            hasUnread: true,
            lastMessage: {
              ...chat.lastMessage,
              content: message.content,
              timestamp: new Date().toISOString(),
            },
          }
        : chat
    )
  );
};
