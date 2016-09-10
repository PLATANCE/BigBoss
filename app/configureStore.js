import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
import rootReducer from './reducers';
import { routerReducer } from 'react-router-redux';
const loggerMiddleware = createLogger();

export default function configureStore(initialState) {
  return createStore(
    rootReducer,
    initialState,
    compose(
      applyMiddleware(
        thunkMiddleware,
        loggerMiddleware
      ),
      // Redux디버거 활성화
      typeof window === 'object' &&
      typeof window.devToolsExtension !== 'undefined' ? window.devToolsExtension() : f => f
    ));
}
