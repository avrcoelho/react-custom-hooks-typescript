import { useEffect, useLayoutEffect, useRef } from "react";

type UseEventListenerOptions = {
  enabled?: boolean;
  target?: any;
};

type UseEventListenerHook = <
  EventType extends keyof GlobalEventHandlersEventMap
>(
  eventType: EventType,
  handler: (e: GlobalEventHandlersEventMap[EventType]) => void,
  options?: UseEventListenerOptions
) => void;

const DEFAULT_OPTIONS: UseEventListenerOptions = {
  enabled: true,
  target: document,
};

export const useEventListener: UseEventListenerHook = (
  eventType,
  handler,
  options = DEFAULT_OPTIONS
) => {
  const { enabled = true, target = document } = options;
  const handlerRef = useRef(handler);

  useLayoutEffect(() => {
    handlerRef.current = handler;
  });

  useEffect(() => {
    if (enabled) {
      return () => null;
    }

    const eventHandler: typeof handlerRef.current = (e) => {
      handlerRef.current.call(target, e);
    };

    target.addEventListener(eventType, eventHandler);
    return () => {
      target.removeEventListener(eventType, eventHandler);
    };
  }, [eventType, target, enabled]);
};
