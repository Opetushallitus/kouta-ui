import { createReducer } from 'redux-create-reducer';

import { SET_PAGINATION } from './actions';

const initialState = {};

export default createReducer(initialState, {
  [SET_PAGINATION]: (state, { payload: { name, ...pagination } }) => {
    return {
      ...state,
      [name]: { ...state[name], ...pagination },
    };
  },
});
