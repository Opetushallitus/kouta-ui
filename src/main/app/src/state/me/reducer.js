import { createReducer } from 'redux-create-reducer';

import { UPDATE } from './actions';

const initialState = {
  organisaatioOid: '1.2.246.562.10.594252633210',
  kayttajaOid: '1.2.246.562.24.62301161440',
};

export default createReducer(initialState, {
  [UPDATE]: (state, { payload = {} }) => ({
    ...state,
    ...payload,
  }),
});
