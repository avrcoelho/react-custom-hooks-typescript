import { useCallback, useLayoutEffect, useReducer, useRef } from 'react';

type MutationFunction<TData, TVariables> = (
  variables: TVariables,
) => Promise<TData | undefined>;

type UseMutationResponse<TFunction> = {
  isError: boolean;
  isSuccess: boolean;
  isLoading: boolean;
  mutate: TFunction;
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

const reducer = (state: typeof INITIAL_STATE, action: ReducerAction) => {
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
    default:
      return { ...state, isLoading: false };
  }
};

export const useMutation = <TData = unknown, TVariables = void>(
  fn: MutationFunction<TData, TVariables>,
): UseMutationResponse<MutationFunction<TData, TVariables>> => {
  const handler = useRef(fn);
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  useLayoutEffect(() => {
    handler.current = fn;
  });

  const mutate = useCallback(
    async (variables: TVariables): Promise<TData | undefined> => {
      let responseData: TData | undefined;
      try {
        dispatch({ type: 'loading' });
        responseData = await handler.current(variables);
        dispatch({ type: 'success' });
      } catch {
        dispatch({ type: 'error' });
      } finally {
        dispatch({ type: 'finally' });
      }
      return responseData;
    },
    [],
  );

  return {
    isLoading: state.isLoading,
    isError: state.isError,
    isSuccess: state.isSuccess,
    mutate,
  };
};
