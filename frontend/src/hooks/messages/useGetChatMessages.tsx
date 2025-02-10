import { useQuery } from "@tanstack/react-query";
import { getMessages } from "../../api/messageService.tsx";

export const useGetChatMessages = () => {
  return useQuery({
    queryKey: ["messages"],
    queryFn: getMessages,
  });
};
