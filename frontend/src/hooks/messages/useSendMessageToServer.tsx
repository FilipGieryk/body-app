import { useQueryClient, useMutation } from "@tanstack/react-query";
import { sendMessageToServer } from "../../api/messageService.tsx";
import { updateMessagesAndChats } from "../../utils/chatCacheUtils.ts";

export const useSendMessageToServer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: sendMessageToServer,
    onMutate: (variables) => {
      const { chatId, content } = variables;
      const newMessage = {
        content,
        sender: "You",
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
    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["messages", variables.chatId],
      });
    },
  });
};
