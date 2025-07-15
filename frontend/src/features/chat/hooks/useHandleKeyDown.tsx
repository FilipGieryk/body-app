import { useCallback } from "react";
import { useSendMessageToServer } from "./useSendMessageToServer";
import { v4 as uuidv4 } from "uuid";

interface UseHandleKeyDownProps {
  inputValue: string;
  setInputValue: (value: string) => void;
  chatId: string;
}

export const useHandleKeyDown = ({
  inputValue,
  setInputValue,
  chatId,
}: UseHandleKeyDownProps) => {
  const { mutate, isError, isPending } = useSendMessageToServer();

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && inputValue.trim()) {
        const clientId = uuidv4();
        mutate(
          { content: inputValue.trim(), chatId, clientId },
          {
            onSuccess: () => {
              setInputValue(""); // Clear input after successful mutation
            },
          }
        );
      }
    },
    [inputValue, chatId, mutate, setInputValue]
  );

  return handleKeyDown;
};
