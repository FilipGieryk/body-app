import { QueryClient } from "@tanstack/react-query";

export const updateMessagesAndChats = (
  queryClient: QueryClient,
  chatId: string,
  message: any
) => {
  // Update messages (infinite)
  queryClient.setQueryData(["messages", chatId], (oldData: any) => {
    if (!oldData || !oldData.pages) return oldData;
    const alreadyExists = oldData.pages.some(
      (page) => page.messages.some((msg) => msg.clientId === message.clientId) // or another unique identifier
    );
    if (alreadyExists) return oldData;
    const newPages = oldData.pages.map((page, index) =>
      index === 0 ? { ...page, messages: [message, ...page.messages] } : page
    );
    return { ...oldData, pages: newPages, pageParams: [...oldData.pageParams] };
  });
  // Update chats (infinite)
  queryClient.setQueryData(["chats"], (oldData: any) => {
    if (!oldData || !oldData.pages) return oldData;
    let didChange = false;

    const newPages = oldData.pages.map((page) => {
      const updatedChats = page.chats.map((chat) => {
        if (chat.chatId !== chatId) return chat;

        // Compare lastMessage deeply
        const prev = chat.lastMessage || {};
        const isSameContent = prev.content === message.content;
        const isSameTimestamp = prev.timestamp === message.timestamp;

        // Only update if something is different
        if (isSameContent && isSameTimestamp && chat.hasUnread) return chat;

        didChange = true;
        return {
          ...chat,
          hasUnread: true,
          lastMessage: {
            ...prev,
            content: message.content,
            timestamp:
              message.timestamp || prev.timestamp || new Date().toISOString(),
          },
        };
      });

      // Only return a new page object if chats changed
      return page.chats === updatedChats
        ? page
        : { ...page, chats: updatedChats };
    });

    // Only return new data if something changed
    return didChange ? { ...oldData, pages: newPages } : oldData;
  });
};
