import { renderHook, act } from '@testing-library/react-hooks';

import { useMutation } from '../useMutation';

describe('useMutation hook', () => {
  it('should be able to return success on request', async () => {
    const { result, waitForNextUpdate } = renderHook(() =>
      useMutation(() => Promise.resolve(true)),
    );

    act(() => {
      result.current.mutate();
    });
    await waitForNextUpdate();

    expect(result.current.isSuccess).toBeTruthy();
  });

  it('should be able to return error on request', async () => {
    const { result, waitForNextUpdate } = renderHook(() =>
      useMutation(() => Promise.reject(true)),
    );

    act(() => {
      result.current.mutate();
    });
    await waitForNextUpdate();

    expect(result.current.isError).toBeTruthy();
  });
});
