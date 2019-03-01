import { createReducer } from 'redux-create-reducer';

import { ADD_FAVOURITE, REMOVE_FAVOURITE } from './actions';

const initialState = {};

export default createReducer(initialState, {
  [ADD_FAVOURITE]: (state, { payload: oid }) => {
    return {
      ...state,
      [oid]: true,
    };
  },
  [REMOVE_FAVOURITE]: (state, { payload: oid }) => {
    const clone = { ...state };

    delete clone[oid];

    return clone;
  },
});
