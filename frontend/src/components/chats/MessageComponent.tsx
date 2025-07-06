import { useState } from "react";
import { useParams } from "react-router-dom";
import { useUser } from "../../hooks/UserContext";
import { useAutoScroll } from "../../hooks/useAutoScroll";
import { useGetChatMessages } from "../../hooks/fetch/messages/useGetChatMessages";
import { useHandleKeyDown } from "../../hooks/messages/useHandleKeyDown";
import React from "react";
const MessageComponent = () => {
  const [inputValue, setInputValue] = useState("");
  const { chatId } = useParams();
  if (!chatId) {
    return;
  }

  const { data, isLoading, isError, error } = useGetChatMessages(chatId);
  const handleKeyDown = useHandleKeyDown({
    inputValue,
    setInputValue,
    chatId,
  });
  const containerRef = useAutoScroll(data);
  // const socket = useWebSocket();

  const { loggedUserInfo, chats } = useUser();

  if (isLoading) {
    return <div>Loading Messages...</div>;
  }
  if (isError) {
    return <div>Error Loading Messages</div>;
  }
  console.log(data);

  // const currentChat = chats.find(
  //   (chat: { chatId: string | undefined }) => chat?.chatId === chatId
  // );

  // useEffect(() => {
  //   if (!socket) return;

  //   const handleWebSocketMessage = (event: { data: string }) => {
  //     const message = JSON.parse(event.data);

  //     if (message.type === "chat-message") {
  //       setMessages((prevMessages: any) => [...prevMessages, message]);
  //     }
  //   };
  //   socket.addEventListener("message", handleWebSocketMessage);

  //   return () => {
  //     socket.removeEventListener("message", handleWebSocketMessage);
  //   };
  // }, [socket]);
  // do this with sendmessage or separate api aclls and hooks

  return (
    <div className="grid grid-rows-[10%_80%_10%] h-full min-h-full max-h-full rounded-4xl">
      <div className="flex items-center gap-8 w-full">
        {/* <img src={currentChat?.profilePhoto} className="h-28 rounded-4xl"></img>
          <h1>{currentChat?.chatName}</h1> */}
      </div>
      <div
        className="w-full rounded-2xl h-full flex flex-col self-center overflow-y-auto bg-[length:90%_100%]"
        ref={containerRef}
      >
        {data.map((message, index) => (
          <div
            key={index}
            className={`text-4xl w-max px-2 py-8 rounded-4xl ${
              message.senderId === loggedUserInfo._id || !message.senderId
                ? "self-end"
                : "self-start"
            }`}
          >
            {message.content}
          </div>
        ))}
      </div>
      <div className=" flex-row items-center justify-center rounded-[0 0 0 2rem]">
        <input
          className="w-[80%] h-[40%] rounded-4xl"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
        ></input>
      </div>
    </div>
  );
};

export default MessageComponent;
