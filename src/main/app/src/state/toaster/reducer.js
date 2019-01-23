import { createReducer } from 'redux-create-reducer';

import { CREATE_TOAST, REMOVE_TOAST } from './actions';

const initialState = {
  toasts: [],
};

export default createReducer(initialState, {
  [CREATE_TOAST]: (state, { payload: toast }) => ({
    ...state,
    toasts: [toast, ...state.toasts],
  }),
  [REMOVE_TOAST]: (state, { payload: key }) => ({
    ...state,
    toasts: [...state.toasts.filter(({ key: k }) => k !== key)],
  }),
});
