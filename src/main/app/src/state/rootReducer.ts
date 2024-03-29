import { produce } from 'immer';
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
    // Which fields in the current redux-form were unregistered (removed from DOM)?
    // This works because UNREGISTER_FIELD is not emitted on initial render when the fields are already hidden.
    unregisteredFields: (
      state: Record<string, { name: string }> = {},
      action: { type: string; payload: { name: string } }
    ) => {
      switch (action?.type) {
        case '@@redux-form/INITIALIZE':
        case '@@redux-form/DESTROY':
          return {};
        case '@@redux-form/REGISTER_FIELD':
          return produce(state, draft => {
            delete draft[action.payload.name];
          });
        case '@@redux-form/UNREGISTER_FIELD':
          return {
            ...state,
            [action.payload.name]: { name: action.payload.name },
          };
        default:
          return state;
      }
    },
    ...reducers,
  });
