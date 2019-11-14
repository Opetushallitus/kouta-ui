import { createReducer } from 'redux-create-reducer';
import { SET_ORGANISAATIO, SET_TOTEUTUS_DEFAULT_NAME } from './actions';

const initialState = {
  nimi: null,
};

export default createReducer(initialState, {
  [SET_TOTEUTUS_DEFAULT_NAME]: (state, { payload: nimi }) => {
    return {
      ...state,
      nimi,
    };
  },
});
