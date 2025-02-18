import React from "react";
import { Link } from "react-router-dom";
import { useUser } from "../../hooks/UserContext";

export const ChatComponent = () => {
  const { chats } = useUser();
  return (
    <>
      {chats
        .filter((el: { lastMessage: any }) => el?.lastMessage)
        .sort(
          (
            a: { lastMessage: { timestamp: any | number } },
            b: { lastMessage: { timestamp: any | number } }
          ) =>
            new Date(b.lastMessage.timestamp).getTime() -
            new Date(a.lastMessage.timestamp).getTime()
        )
        .map((chat: any) => (
          <Link className="decoration-0" to={`/chat/${chat.chatId}`}>
            <div className="flex items-center decoration-0 h-32 w-full gap-4 bg-[url(./assets/user-brush.png)] bg-[length:100%_100%]">
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
                <div className="w-5 h-5 bg-red-500 absolute top-2 -right-3 rounded-[50%] translate-y-[-100%]"></div>
              )}
            </div>
          </Link>
        ))}
    </>
  );
};
