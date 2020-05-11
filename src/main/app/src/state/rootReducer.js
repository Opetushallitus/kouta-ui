import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import hardSet from 'redux-persist/lib/stateReconciler/hardSet';

import toaster from './toaster';
import organisaatioFavourites from './organisaatioFavourites';
import organisaatioSelection from './organisaatioSelection';
import pagination from './pagination';

export default (reducers = {}) =>
  combineReducers({
    toaster,
    pagination,
    organisaatioFavourites: persistReducer(
      {
        storage,
        key: 'organisaatioFavourites',
        stateReconciler: hardSet,
        version: 1,
      },
      organisaatioFavourites
    ),
    organisaatioSelection: persistReducer(
      {
        storage,
        key: 'organisaatioSelection',
        stateReconciler: hardSet,
        version: 1,
      },
      organisaatioSelection
    ),
    ...reducers,
  });
