import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import { reducer as formReducer } from 'redux-form';
import createRootReducer from './rootReducer';

const rootReducer = createRootReducer({
  form: formReducer,
});

const context = {};

const middleware = applyMiddleware(thunk.withExtraArgument(context));

const enhancer =
  process.env.NODE_ENV === 'development'
    ? composeWithDevTools(compose(middleware))
    : undefined;

const store = createStore(rootReducer, enhancer);

export default store;
