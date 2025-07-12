import { useQuery } from "@tanstack/react-query";
import { fetchChats } from "../api/chatService";

export const useGetChats = () =>
  useQuery({
    queryKey: ["chats"],
    queryFn: fetchChats,
  });
