import {createStore, combineReducers, compose, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import stateData from './initialState.js';
import {
  fetchSuccess,
  submitType,
  tracksHasErrored,
  tracksIsFetching,
} from './reducers';

const saver = (store) => (next) => (action) => {
  const result = next(action);
  localStorage['redux-store'] = JSON.stringify(store.getState());
  return result;
};

const logger = (store) => (next) => (action) => {
  console.group(action.type);
  console.info('dispatching', action);
  const result = next(action);
  console.log('next state', store.getState());
  console.groupEnd(action.type);
  return result;
};

const reducers = combineReducers({
  fetchSuccess,
  tracksHasErrored,
  tracksIsFetching,
  submitType,
});

const middleware = [saver, logger, thunk];

export default function configureStore(initialState = stateData) {
  return createStore(
    reducers,
    (localStorage['redux-store']) ?
      JSON.parse(localStorage['redux-store']) :
      initialState,
    composeWithDevTools(applyMiddleware(...middleware),),
  );
}
