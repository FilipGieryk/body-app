export const isAnyUnread = (chats) => {
  const numOfUnread = chats?.filter((chat) => chat.hasUnread == true).length;
  return numOfUnread > 0;
};
