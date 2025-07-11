import { useState } from "react";
import { useParams } from "react-router-dom";
import { useAutoScroll } from "../../../hooks/useAutoScroll";
import { useGetChatMessages } from "../hooks/useGetChatMessages";
import { useHandleKeyDown } from "../../../hooks/messages/useHandleKeyDown";
import { useLoggedUserInfo } from "../../../hooks/fetch/useLoggedUserInfo";
const MessageComponent = ({ otherParticipants, chatId }) => {
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = useHandleKeyDown({
    inputValue,
    setInputValue,
    chatId,
  });

  const { data: messages, isLoading } = useGetChatMessages(chatId, {
    enabled: !!chatId,
  });

  const containerRef = useAutoScroll(messages);

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="grid grid-rows-[80%_10%] h-full min-h-full max-h-full rounded-4xl">
      <div
        className="w-full rounded-2xl h-full flex flex-col self-center overflow-y-auto bg-[length:90%_100%]"
        ref={containerRef}
      >
        {messages.map((message, index) => (
          <div
            key={index}
            className={`text-4xl w-max px-2 py-8 rounded-4xl ${
              message.senderId != otherParticipants || !message.senderId
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
