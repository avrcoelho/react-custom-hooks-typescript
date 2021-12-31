import { renderHook } from '@testing-library/react-hooks';

import { useAsyncEffect } from '../useAsyncEffect';

describe('useAsyncEffect hook', () => {
  it('should be able to return data', async () => {
    expect(() => {
      renderHook(() =>
        useAsyncEffect(async () => {
          Promise.resolve(true);
        }),
      );
    }).not.toThrow();
  });

  it('should be able to destructior function', async () => {
    expect(() => {
      renderHook(() =>
        useAsyncEffect(
          async () => {
            Promise.resolve(true);
          },
          jest.fn(),
          [],
        ),
      );
    }).not.toThrow();
  });
});
