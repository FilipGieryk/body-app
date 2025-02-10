import { useMutation } from "@tanstack/react-query";
import { sendMessageToServer } from "../../api/messageService.tsx";

export const useSendMessageToServer = () => {
  return useMutation({
    mutationFn: sendMessageToServer,
    onSuccess: (data) => console.log("success", data),
    onError: (error) => console.error("error sending message", error),
  });
};
