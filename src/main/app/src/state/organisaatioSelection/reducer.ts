import { createReducer } from 'redux-create-reducer';
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
