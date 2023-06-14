import { configureStore } from '@reduxjs/toolkit';
import { reducer as formReducer } from 'redux-form';
import { persistStore } from 'redux-persist';

import { isDev } from '#/src/utils';

import { createRootReducer } from './rootReducer';

export const store = () => {
  const rootReducer = createRootReducer({
    form: formReducer,
  });

  const store = configureStore({ reducer: rootReducer, devTools: isDev });

  const persistor = persistStore(store);

  return { store, persistor };
};
