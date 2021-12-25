import { useLayoutEffect, useRef, useState } from "react";

type MutationFunction<TData, TVariables> = (
  variables: TVariables
) => Promise<TData | undefined>;

type UseMumationResponse<TFunction> = {
  isError: boolean;
  isSuccess: boolean;
  isLoading: boolean;
  mutate: TFunction;
};

export const useMumation = <TData = unknown, TVariables = unknown>(
  fn: MutationFunction<TData, TVariables>
): UseMumationResponse<MutationFunction<TData, TVariables>> => {
  const handler = useRef(fn);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

  useLayoutEffect(() => {
    handler.current = fn;
  });

  const executeMutation = async (
    variables: TVariables
  ): Promise<TData | undefined> => {
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
  };

  const executeMutationRef = useRef(executeMutation);

  return {
    isLoading,
    isError,
    isSuccess,
    mutate: executeMutationRef.current,
  };
};
