import { configureStore } from '@reduxjs/toolkit';
import { reducer as formReducer } from 'redux-form';
import { persistStore } from 'redux-persist';

import { isDev } from '#/src/utils';

import { createRootReducer } from './rootReducer';

export const store = () => {
  const rootReducer = createRootReducer({
    form: formReducer,
  });

  const store = configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware({
        // Browser slows down and becomes unresponsive because of state and immutable-state-invariant
        // https://github.com/reduxjs/redux-toolkit/issues/415#issuecomment-596812204
        immutableCheck: false,
        // Non-serializable data should not be put in redux state:
        // https://redux.js.org/faq/organizing-state#can-i-put-functions-promises-or-other-non-serializable-items-in-my-store-state
        // However, we are using draft.js and its EditorState (Record type) is put in state which is why serializableCheck is disabled for now
        // https://stackoverflow.com/a/63244831
        serializableCheck: false,
      }),
    devTools: isDev,
  });

  const persistor = persistStore(store);

  return { store, persistor };
};
