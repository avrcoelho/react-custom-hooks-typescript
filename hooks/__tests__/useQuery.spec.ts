import { renderHook, act } from '@testing-library/react-hooks';

import { useQuery } from '../useQuery';

describe('useQuery hook', () => {
  it('should be able to return success on request', async () => {
    const { result, waitForNextUpdate } = renderHook(() =>
      useQuery(() => Promise.resolve(true)),
    );
    await waitForNextUpdate();

    expect(result.current.data).toBeTruthy();
  });

  it('should be able to return error on request', async () => {
    const { result, waitForNextUpdate } = renderHook(() =>
      useQuery(() => Promise.reject(true)),
    );
    await waitForNextUpdate();

    expect(result.current.isError).toBeTruthy();
  });

  it('should be able to return success on request when call refecth', async () => {
    const { result, waitForNextUpdate } = renderHook(() =>
      useQuery(() => Promise.resolve(true), { manualFetch: true }),
    );

    act(() => {
      result.current.refetch();
    });
    await waitForNextUpdate();

    expect(result.current.data).toBeTruthy();
  });
});
