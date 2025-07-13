export const updateMessagesAndChats = (
  queryClient: QueryClient,
  chatId: string,
  message: any
) => {
  // Update messages (infinite)
  queryClient.setQueryData(["messages", chatId], (oldData: any) => {
    if (!oldData || !oldData.pages) {
      return {
        pages: [{ messages: [message], nextPage: null }],
        pageParams: [1],
      };
    }

    const newPages = oldData.pages.map((page, index) =>
      index === oldData.pages.length - 1
        ? { ...page, messages: [...page.messages, message] }
        : page
    );

    return { ...oldData, pages: newPages, pageParams: [...oldData.pageParams] };
  });

  // Update chats (infinite)
  queryClient.setQueryData(["chats"], (oldData: any) => {
    if (!oldData || !oldData.pages) return oldData;

    let didChange = false;

    const newPages = oldData.pages.map((page) => {
      const updatedChats = page.chats.map((chat) => {
        if (chat.chatId === chatId) {
          const isSame = chat.lastMessage?.content === message.content;
          if (isSame && chat.hasUnread) return chat;

          didChange = true;
          return {
            ...chat,
            hasUnread: true,
            lastMessage: {
              ...chat.lastMessage,
              content: message.content,
              timestamp: new Date().toISOString(),
            },
          };
        }
        return chat;
      });

      return { ...page, chats: updatedChats };
    });

    return didChange ? { ...oldData, pages: newPages } : oldData;
  });
};
