import { useQueryClient, useMutation } from "@tanstack/react-query";
import { sendMessageToServer } from "../../api/messageService.tsx";

export const useSendMessageToServer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: sendMessageToServer,
    onMutate: (variables) => {
      const previousMessages = queryClient.getQueryData([
        "messages",
        variables.chatId,
      ]);
      queryClient.setQueryData(
        ["messages", variables.chatId],
        (oldMessages: any) => [
          ...oldMessages,
          { content: variables.content, sender: "You", timestamp: new Date() },
        ]
      );

      return { previousMessages };
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
