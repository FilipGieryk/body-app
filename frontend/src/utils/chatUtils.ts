export const getOtherParticipants = (participants, userId) => {
  return participants?.filter((participantsId) => participantsId != userId);
};
