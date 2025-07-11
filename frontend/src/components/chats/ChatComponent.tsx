import React, { useEffect } from "react";
import { Link } from "react-router-dom";

import { useMarkMessagesAsRead } from "../../hooks/fetch/useMarkMessagesAsRead";
import { useGetChats } from "../../hooks/fetch/chats/useGetChats";

export const ChatComponent = ({ chats }) => {
  return (
    <div>
      {chats?.map((chat: any) => (
        <Link
          className="decoration-0 flex items-center h-32 w-full gap-4 relative"
          to={`/chat/${chat.chatId}`}
        >
          <img
            className="h-28 rounded-4xl"
            src={chat.profilePhoto}
            alt="friend-profile-picture"
          ></img>
          <div className="text-xl">
            <h2>{chat.chatName}</h2>
            <p className="m-0">{chat.lastMessage?.content}</p>
          </div>
          {chat.hasUnread && (
            <span className="w-5 h-5 bg-red-500 absolute rounded-[50%] top-0 right-0"></span>
          )}
        </Link>
      ))}
    </div>
  );
};
