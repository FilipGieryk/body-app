export const getOtherParticipants = (participants, userId) => {
  return participants?.filter((participantsId) => participantsId != userId);
};
export const getSortedChats = (chats) => {
  return chats
    ?.filter((el: { lastMessage: any }) => el?.lastMessage)
    .sort(
      (
        a: { lastMessage: { timestamp: any | number } },
        b: { lastMessage: { timestamp: any | number } }
      ) =>
        new Date(b.lastMessage.timestamp).getTime() -
        new Date(a.lastMessage.timestamp).getTime()
    );
};
