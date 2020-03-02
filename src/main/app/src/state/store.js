import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import { reducer as formReducer } from 'redux-form';
import { persistStore } from 'redux-persist';
import { isDev } from '../utils';
import createRootReducer from './rootReducer';

export default ({ apiUrls, httpClient, history, localisation }) => {
  const rootReducer = createRootReducer({
    form: formReducer,
  });

  const context = {
    httpClient,
    apiUrls,
    history,
    localisation,
  };

  const middleware = applyMiddleware(thunk.withExtraArgument(context));

  const enhancer = isDev
    ? composeWithDevTools(compose(middleware))
    : compose(middleware);

  const store = createStore(rootReducer, enhancer);

  const persistor = persistStore(store);

  return { store, persistor };
};
