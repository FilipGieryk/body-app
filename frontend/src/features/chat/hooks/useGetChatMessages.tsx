import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { getMessages } from "../api/messageService.tsx";

export const useGetChatMessages = (
  chatId: string | undefined,
  options = {}
) => {
  return useInfiniteQuery({
    queryKey: ["messages", chatId],
    queryFn: getMessages,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 1,
    enabled: !!chatId,
    ...options,
  });
};
