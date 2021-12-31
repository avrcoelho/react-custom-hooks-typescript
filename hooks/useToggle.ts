import { useReducer } from 'react';

export const useToggle = (initialValue: boolean) =>
  useReducer((prevState: boolean) => !prevState, initialValue);
