import { useLayoutEffect, useRef, useState } from "react";

type MutationFunction<TData, TVariables> = (
  variables: TVariables
) => Promise<TData | undefined>;

type UseMumationResponse<Data, MFunction> = {
  isError: boolean;
  isSuccess: boolean;
  isLoading: boolean;
  mutate: MFunction;
};

export const useMumation = <Data = unknown, Variables = unknown>(
  effect: MutationFunction<Data, Variables>
): UseMumationResponse<Data, MutationFunction<Data, Variables>> => {
  const handler = useRef(effect);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

  useLayoutEffect(() => {
    handler.current = effect;
  });

  const executeMutation = async (
    variables: Variables
  ): Promise<Data | undefined> => {
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

const test = (t: string) => Promise.resolve(t);

const { mutate } = useMumation(test);

mutate("1");
