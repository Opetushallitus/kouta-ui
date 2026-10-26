import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import hardSet from 'redux-persist/lib/stateReconciler/hardSet';
import storage from 'redux-persist/lib/storage';

import organisaatioFavourites from './organisaatioFavourites';
import organisaatioSelection from './organisaatioSelection';

export const createRootReducer = (reducers = {}) =>
  combineReducers({
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
