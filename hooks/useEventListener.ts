import { useEffect, useLayoutEffect, useRef } from 'react';

type UseEventListenerOptions = {
  disabled?: boolean;
  target?: Document | Element;
};

type UseEventListenerHook = <
  EventType extends keyof GlobalEventHandlersEventMap,
>(
  eventType: EventType,
  handler: (e: GlobalEventHandlersEventMap[EventType]) => void,
  options?: UseEventListenerOptions,
) => void;

const DEFAULT_OPTIONS: UseEventListenerOptions = {
  disabled: false,
  target: document,
};

export const useEventListener: UseEventListenerHook = (
  eventType,
  handler,
  { disabled, target } = DEFAULT_OPTIONS,
) => {
  const handlerRef = useRef(handler);

  useLayoutEffect(() => {
    handlerRef.current = handler;
  });

  useEffect(() => {
    if (disabled) {
      return () => null;
    }

    const eventHandler: EventListener = e => {
      handlerRef.current.call(target, e);
    };

    target?.addEventListener(eventType, eventHandler);
    return () => {
      target?.removeEventListener(eventType, eventHandler);
    };
  }, [eventType, target, disabled]);
};
