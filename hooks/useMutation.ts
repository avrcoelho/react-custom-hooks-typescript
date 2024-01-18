import { useCallback, useLayoutEffect, useReducer, useRef } from 'react';

type MutationFunction<Data, Variables> = (
  variables: Variables,
) => Promise<Data | undefined>;

type UseMutationResponse<TFunction> = {
  isError: boolean;
  isSuccess: boolean;
  isLoading: boolean;
  mutate: TFunction;
  reset(): void;
};

type UseMutationOptions<Data> = {
  onSuccess?(data: Data | undefined): void;
  onError?(error: unknown): void;
};

type ReducerAction = {
  type: string;
  data?: unknown;
};

const INITIAL_STATE = {
  isLoading: false,
  isSuccess: false,
  isError: false,
};

const reducer = (
  state: typeof INITIAL_STATE,
  action: ReducerAction,
): typeof INITIAL_STATE => {
  switch (action.type) {
    case 'loading':
      return {
        ...state,
        isLoading: true,
        isSuccess: false,
        isError: false,
      };
    case 'success':
      return { ...state, isSuccess: true };
    case 'error':
      return { ...state, isError: true };
    case 'reset':
      return INITIAL_STATE;
    default:
      return { ...state, isLoading: false };
  }
};

export const useMutation = <Data = unknown, Variables = void>(
  handler: MutationFunction<Data, Variables>,
  options?: UseMutationOptions<Data>,
): UseMutationResponse<MutationFunction<Data, Variables>> => {
  const handlerRef = useRef(handler);
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  useLayoutEffect(() => {
    handlerRef.current = handler;
  });

  const mutate = useCallback(
    async (variables: Variables): Promise<Data | undefined> => {
      let responseData: Data | undefined;
      try {
        dispatch({ type: 'loading' });
        responseData = await handlerRef.current(variables);
        dispatch({ type: 'success' });
        options?.onSuccess?.(responseData);
      } catch (error) {
        dispatch({ type: 'error' });
        options?.onError?.(error);
      } finally {
        dispatch({ type: 'finally' });
      }
      return responseData;
    },
    [options],
  );

  const reset = useCallback(() => {
    dispatch({ type: 'reset' });
  }, []);

  return {
    isLoading: state.isLoading,
    isError: state.isError,
    isSuccess: state.isSuccess,
    mutate,
    reset,
  };
};
