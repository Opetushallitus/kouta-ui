import { createReducer } from '@reduxjs/toolkit';

import { ADD_FAVOURITE, REMOVE_FAVOURITE } from './actions';

const initialState = {
  byOid: {},
};

export default createReducer(initialState, {
  [ADD_FAVOURITE]: (state, { payload: oid }) => {
    state.byOid[oid] = true;
  },
  [REMOVE_FAVOURITE]: (state, { payload: oid }) => {
    delete state.byOid[oid];
  },
});
