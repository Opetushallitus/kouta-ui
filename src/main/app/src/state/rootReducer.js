import { combineReducers } from 'redux';

import me from './me';
import toaster from './toaster';

export default (reducers = {}) =>
  combineReducers({
    me,
    toaster,
    ...reducers,
  });
