import { useQueryClient, useMutation } from "@tanstack/react-query";
import { sendMessageToServer } from "../api/messageService.tsx";
import { updateMessagesAndChats } from "../utils/chatCacheUtils.ts";
import { v4 as uuidv4 } from "uuid";

export const useSendMessageToServer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: sendMessageToServer,
    onMutate: (variables) => {
      const { chatId, content, clientId } = variables;
      const newMessage = {
        content,
        sender: "You",
        clientId,
        timestamp: new Date().toISOString(),
      };
      const previousMessages = queryClient.getQueryData(["messages", chatId]);
      const previousChats = queryClient.getQueryData(["chats"]);

      updateMessagesAndChats(queryClient, chatId, newMessage);
      return { previousMessages, previousChats };
    },
    onError: (error, variables, context) => {
      if (context) {
        queryClient.setQueryData(
          ["messages", variables.chatId],
          context.previousMessages
        );
      }
      console.error("Error sending message:", error);
    },
    // onSettled: (data, error, variables) => {
    //   queryClient.invalidateQueries({
    //     queryKey: ["messages", variables.chatId],
    //   });
    // },
  });
};
