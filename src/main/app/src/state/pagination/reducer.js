import { createReducer } from 'redux-create-reducer';

import { SET_PAGE } from './actions';

const initialState = {};

export default createReducer(initialState, {
  [SET_PAGE]: (state, { payload: { name, page } }) => {
    return {
      ...state,
      [name]: page,
    };
  },
});
