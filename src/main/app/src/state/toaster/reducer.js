import { createReducer } from 'redux-create-reducer';

import { OPEN_TOAST, CLOSE_TOAST } from './actions';

const initialState = {
  toasts: [],
};

export default createReducer(initialState, {
  [OPEN_TOAST]: (state, { payload: toast }) => ({
    ...state,
    toasts: [toast, ...state.toasts],
  }),
  [CLOSE_TOAST]: (state, { payload: key }) => ({
    ...state,
    toasts: [...state.toasts.filter(({ key: k }) => k !== key)],
  }),
});
