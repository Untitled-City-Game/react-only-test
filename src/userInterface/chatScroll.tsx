import { RefObject, useEffect, useRef } from "react";

export function useAutoScrollToBottom<T extends HTMLElement>(
  dependencies: any[]
): RefObject<T | null> {
  const containerRef = useRef<T | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const isAtBottom =
      container.scrollHeight - container.scrollTop <= container.clientHeight + 10;

    if (isAtBottom) {
      container.scrollTop = container.scrollHeight;
    }
  }, dependencies);

  return containerRef;
}