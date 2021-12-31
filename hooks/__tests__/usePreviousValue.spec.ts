import { renderHook } from '@testing-library/react-hooks';

import { usePreviousValue } from '../usePreviousValue';

describe('usePreviousValue hook', () => {
  it('should be able to change value', async () => {
    const { result } = renderHook(() => usePreviousValue('test'));

    expect(result.current).toBe('test');
  });
});
