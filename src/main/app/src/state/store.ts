import { configureStore } from '@reduxjs/toolkit';
import { reducer as formReducer } from 'redux-form';
import { persistStore } from 'redux-persist';

import { isDev } from '#/src/utils';

import { createRootReducer } from './rootReducer';

export const store = configureStore({
  reducer: createRootReducer({
    form: formReducer,
  }),
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

export const persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
