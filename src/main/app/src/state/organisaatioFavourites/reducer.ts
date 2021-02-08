import produce from 'immer';
import { createReducer } from 'redux-create-reducer';

import { ADD_FAVOURITE, REMOVE_FAVOURITE } from './actions';

const initialState = {
  byOid: {},
};

export default createReducer(initialState, {
  [ADD_FAVOURITE]: (state, { payload: oid }) => {
    return {
      ...state,
      byOid: produce(state.byOid, draft => {
        draft[oid] = true;
      }),
    };
  },
  [REMOVE_FAVOURITE]: (state, { payload: oid }) => {
    return {
      ...state,
      byOid: produce(state.byOid, draft => {
        delete draft[oid];
      }),
    };
  },
});
