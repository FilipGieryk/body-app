import { useCallback } from "react";
import { useSendMessageToServer } from "../fetch/useSendMessageToServer";

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
        mutate(
          { content: inputValue.trim(), chatId },
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
