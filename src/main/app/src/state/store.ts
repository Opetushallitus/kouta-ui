import { createStore, compose, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { reducer as formReducer } from 'redux-form';
import { persistStore } from 'redux-persist';
import thunk from 'redux-thunk';

import { isDev } from '#/src/utils';

import { createRootReducer } from './rootReducer';

export const store = () => {
  const rootReducer = createRootReducer({
    form: formReducer,
  });

  const enhancer = isDev
    ? composeWithDevTools(compose(applyMiddleware(thunk)))
    : compose(applyMiddleware(thunk));

  const store = createStore(rootReducer, enhancer);

  const persistor = persistStore(store);

  return { store, persistor };
};
