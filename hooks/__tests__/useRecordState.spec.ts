import { act, renderHook } from '@testing-library/react-hooks';

import { useRecordState } from '../useRecordState';

describe('useRecordState hook', () => {
  it('should be able to set initial value', async () => {
    const { result } = renderHook(() => useRecordState({ test: 'test' }));

    expect(result.current[0]).toEqual({ test: 'test' });
  });

  it('should be able to change value', async () => {
    const { result } = renderHook(() => useRecordState({ test: 'test' }));

    act(() => {
      result.current[1]({ test: 'test 2' });
    });
    act(() => {
      result.current[1]({ test: 'test 2' });
    });

    expect(result.current[0]).toEqual({ test: 'test 2' });
  });

  it('should be able to change value in function mode', async () => {
    const { result } = renderHook(() => useRecordState({ test: 'test' }));

    act(() => {
      result.current[1](previousValue => ({
        ...previousValue,
        test2: 'test 2',
      }));
    });

    expect(result.current[0]).toEqual({ test: 'test', test2: 'test 2' });
  });
});
