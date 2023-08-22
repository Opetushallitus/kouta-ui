import {
  TypedUseSelectorHook,
  useDispatch as useReduxDispatch,
  useSelector as useReduxSelector,
} from 'react-redux';

import type { RootState, AppDispatch } from '#/src/state/store';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
type DispatchFunc = () => AppDispatch;
export const useDispatch: DispatchFunc = useReduxDispatch;
export const useSelector: TypedUseSelectorHook<RootState> = useReduxSelector;
