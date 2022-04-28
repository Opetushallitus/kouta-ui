import { createReducer } from '@reduxjs/toolkit';

import { SET_ORGANISAATIO } from './actions';

const initialState = {
  oid: null,
};

export default createReducer(initialState, {
  [SET_ORGANISAATIO]: (state, { payload: oid }) => {
    return {
      ...state,
      oid,
    };
  },
});
