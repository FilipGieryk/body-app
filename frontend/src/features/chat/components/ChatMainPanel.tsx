import React, { useEffect } from "react";
import { getOtherParticipants } from "../utils/chatUtils";
import UserInformation from "../../../shared/components/UserInformation";
import MessageComponent from "./MessageComponent";
import { useMarkMessagesAsRead } from "../hooks/useMarkMessagesAsRead";
import { Chat } from "../types";

type ChatMainPanelProps = {
  chatId: string;
  loggedUserId: string;
  currentChat: Chat;
};

export const ChatMainPanel = ({
  chatId,
  loggedUserId,
  currentChat,
}: ChatMainPanelProps) => {
  const markAsRead = useMarkMessagesAsRead();

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
    <>
      <div className="row-start-1 row-end-1 col-start-2 max-h-10">
        {chatId && (
          <UserInformation
            username={currentChat?.chatName ?? "unknown"}
            profilePhoto={currentChat?.profilePhoto ?? "default-avatar.png"}
            orientation="row"
          />
        )}
      </div>
      <div className="row-start-2 col-start-2">
        {chatId && (
          <MessageComponent chatId={chatId} otherParticipants={participants} />
        )}
      </div>
    </>
  );
};
