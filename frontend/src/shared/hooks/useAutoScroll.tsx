import { useEffect, useRef } from "react";

export const useAutoScroll = <T,>(
  dependencies: T[]
): React.RefObject<HTMLDivElement> => {
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    containerRef.current.scrollTop = containerRef.current.scrollHeight;
  }, [dependencies]);

  return containerRef;
};
