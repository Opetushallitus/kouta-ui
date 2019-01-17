import { combineReducers } from 'redux';

import me from './me';

export default (reducers = {}) =>
  combineReducers({
    me,
    ...reducers,
  });
