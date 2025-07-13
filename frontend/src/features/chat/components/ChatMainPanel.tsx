import React, { useEffect } from "react";
import { getOtherParticipants } from "../utils/chatUtils";
import UserInformation from "../../../shared/components/UserInformation";
import MessageComponent from "./MessageComponent";
import { useMarkMessagesAsRead } from "../hooks/useMarkMessagesAsRead";
import { Chat } from "../types";

type ChatMainPanelProps = {
  chatId: string;
  loggedUserId: string;
  chats: Chat[];
};

const ChatMainPanel = ({ chatId, loggedUserId, chats }: ChatMainPanelProps) => {
  const markAsRead = useMarkMessagesAsRead();

  const currentChat = React.useMemo(() => {
    return chats?.find((chat) => chat.chatId === chatId) ?? null;
  }, [chatId, chats]);

  const participants = React.useMemo(() => {
    if (!currentChat || !loggedUserId) return null;
    return getOtherParticipants(currentChat.participants, loggedUserId);
  }, [currentChat, loggedUserId]);

  useEffect(() => {
    if (currentChat?.hasUnread) {
      markAsRead.mutate(currentChat.chatId);
    }
  }, [currentChat, markAsRead]);

  return (
    <div className="row-start-1 row-end-2 col-start-2">
      {chatId && (
        <UserInformation
          username={currentChat?.chatName ?? "unknown"}
          profilePhoto={currentChat?.profilePhoto ?? "default-avatar.png"}
          orientation="row"
        />
      )}
      {chatId && (
        <MessageComponent chatId={chatId} otherParticipants={participants} />
      )}
    </div>
  );
};

export default ChatMainPanel;
