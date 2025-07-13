import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { fetchChats } from "../api/chatService";

export const useGetChats = () =>
  useInfiniteQuery({
    queryKey: ["chats"],
    queryFn: fetchChats,
    getNextPageParam: (lastPage) => lastPage?.nextPage,
    initialPageParam: 1,
  });
