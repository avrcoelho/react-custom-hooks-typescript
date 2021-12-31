import { renderHook } from '@testing-library/react-hooks';

import { useDebouncedValue } from '../useDebouncedValue';

jest.useFakeTimers();

describe('useDebouncedValue hook', () => {
  it('should be able to return value', async () => {
    const { result } = renderHook(() => useDebouncedValue('test'));
    jest.advanceTimersByTime(500);

    expect(result.current).toBe('test');
  });
});
