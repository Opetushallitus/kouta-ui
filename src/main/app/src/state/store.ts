import { configureStore } from '@reduxjs/toolkit';
import { compose } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { reducer as formReducer } from 'redux-form';
import { persistStore } from 'redux-persist';

import { isDev } from '#/src/utils';

import { createRootReducer } from './rootReducer';

export const store = () => {
  const rootReducer = createRootReducer({
    form: formReducer,
  });

  const enhancer = isDev ? composeWithDevTools(compose()) : compose();

  const store = configureStore({ reducer: rootReducer, enhancers: [enhancer] });

  const persistor = persistStore(store);

  return { store, persistor };
};
