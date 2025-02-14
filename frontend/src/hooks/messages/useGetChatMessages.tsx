import { useQuery } from "@tanstack/react-query";
import { getMessages } from "../../api/messageService.tsx";

export const useGetChatMessages = (chatId: string) => {
  return useQuery({
    queryKey: ["messages", chatId],
    queryFn: () => getMessages(chatId),
  });
};
