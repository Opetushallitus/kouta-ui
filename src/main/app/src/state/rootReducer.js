import { combineReducers } from 'redux';

export default (reducers = {}) =>
  combineReducers({
    reducer: (state = {}, action) => state,
    ...reducers,
  });