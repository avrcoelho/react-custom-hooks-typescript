import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useReducer,
  useRef,
} from 'react';

type UseQueryOptions<Data> = {
  manualFetch?: boolean;
  onSuccess?: (data: Data | undefined) => void;
  onError?: (error: unknown) => void;
};

type UseQueryResponse<Data> = {
  data: Data | undefined;
  isError: boolean;
  isSuccess: boolean;
  isLoading: boolean;
  refetch(): void;
};

type ReducerAction = {
  type: string;
  data?: unknown;
};

type QueryFuntion<Data = unknown> = () => Data | Promise<Data>;

const INITIAL_STATE = {
  isLoading: false,
  isSuccess: false,
  isError: false,
  data: undefined as any,
};

const reducer = (
  state: typeof INITIAL_STATE,
  action: ReducerAction,
): typeof INITIAL_STATE => {
  switch (action.type) {
    case 'loading':
      return { ...state, isLoading: true, isSuccess: false, isError: false };
    case 'success':
      return { ...state, isSuccess: true, data: action.data };
    case 'error':
      return { ...state, isError: true };
    default:
      return { ...state, isLoading: false };
  }
};

export const useQuery = <Data = unknown>(
  handler: QueryFuntion<Data>,
  options?: UseQueryOptions<Data>,
): UseQueryResponse<Data> => {
  const handlerRef = useRef(handler);
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  useLayoutEffect(() => {
    handlerRef.current = handler;
  });

  const executeQuery = useCallback(async (): Promise<void> => {
    try {
      dispatch({ type: 'loading' });
      const responseData = await handlerRef.current();
      dispatch({ type: 'success', data: responseData });
      options?.onSuccess?.(responseData);
    } catch (error) {
      dispatch({ type: 'error' });
      options?.onError?.(error);
    } finally {
      dispatch({ type: 'finally' });
    }
  }, [options?.onSuccess, options?.onError]);

  const isMount = useRef(true);
  useEffect(() => {
    const canExecuteQuery = !options?.manualFetch && isMount.current;
    if (canExecuteQuery) {
      isMount.current = false;
      executeQuery();
    }
  }, [options]);

  return {
    isLoading: state.isLoading,
    isError: state.isError,
    isSuccess: state.isSuccess,
    data: state.data as Data | undefined,
    refetch: executeQuery,
  };
};
