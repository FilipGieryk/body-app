export type Message = {
  chatId: string;
  content: string;
  senderId: string;
  timestamp: Date;
  _id: string;
};

export type Chat = {
  chatId: string;
  chatName: string;
  hasUnread: boolean;
  lastMessage: Message;
  participants: string[];
  profilePhoto: string;
};
