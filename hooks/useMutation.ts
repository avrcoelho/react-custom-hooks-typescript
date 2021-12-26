import { useCallback, useLayoutEffect, useRef, useState } from "react";

type MutationFunction<TData, TVariables> = (
  variables: TVariables
) => Promise<TData | undefined>;

type UseMutationResponse<TFunction> = {
  isError: boolean;
  isSuccess: boolean;
  isLoading: boolean;
  mutate: TFunction;
};

export const useMutation = <TData = unknown, TVariables = void>(
  fn: MutationFunction<TData, TVariables>
): UseMutationResponse<MutationFunction<TData, TVariables>> => {
  const handler = useRef(fn);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

  useLayoutEffect(() => {
    handler.current = fn;
  });

  const mutate = useCallback(
    async (variables: TVariables): Promise<TData | undefined> => {
      try {
        setIsSuccess(false);
        setIsError(false);
        setIsLoading(true);
        const reponseData = await handler.current(variables);
        setIsSuccess(true);
        return reponseData;
      } catch {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return {
    isLoading,
    isError,
    isSuccess,
    mutate,
  };
};
