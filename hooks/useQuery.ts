import { useEffect, useLayoutEffect, useRef, useState } from "react";

type UseQueryOptions = {
  manualFetch?: boolean;
};

type UseQueryResponse<Data> = {
  data: Data | undefined;
  isError: boolean;
  isSuccess: boolean;
  isLoading: boolean;
  refetch(): void;
};

export const useQuery = <Data = unknown>(
  effect: () => Promise<Data>,
  options?: UseQueryOptions
): UseQueryResponse<Data> => {
  const handler = useRef(effect);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [data, setData] = useState<Data>();

  useLayoutEffect(() => {
    handler.current = effect;
  });

  const executeQuery = async (): Promise<void> => {
    try {
      setIsSuccess(false);
      setIsError(false);
      setIsLoading(true);
      const reponseData = await handler.current();
      setData(reponseData as Data | undefined);
      setIsSuccess(true);
    } catch {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const executeQueryRef = useRef(executeQuery);
  useEffect(() => {
    if (!options?.manualFetch) {
      executeQueryRef.current();
    }
  }, [options]);

  return {
    isLoading,
    isError,
    isSuccess,
    data,
    refetch: executeQueryRef.current,
  };
};
