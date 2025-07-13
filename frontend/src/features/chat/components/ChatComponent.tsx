import { Link } from "react-router-dom";
import { Chat } from "../types";
import { useInView } from "react-intersection-observer";
import React from "react";

export const ChatComponent = ({
  chats,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
}) => {
  const { ref, inView } = useInView();

  React.useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div>
      {chats?.map((chat) => (
        <Link
          className="decoration-0 flex items-center h-32 w-full gap-4 relative"
          to={`/chat/${chat.chatId}`}
        >
          <img
            className="h-28 rounded-4xl"
            src={chat.profilePhoto}
            alt="friend-profile-picture"
            loading="lazy"
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
      {hasNextPage && (
        <div ref={ref} className="h-10 text-center text-gray-500">
          {isFetchingNextPage ? "Loading more chats..." : "Scroll to load more"}
        </div>
      )}
    </div>
  );
};
