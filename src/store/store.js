import {createStore, combineReducers, compose, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import stateData from './initialState.js';

const saver = (store) => (next) => (action) => {
  const result = next(action);
  localStorage['redux-store'] = JSON.stringify(store.getState());
  return result;
};

const storeFactory = (initialState = stateData) =>
  applyMiddleware(saver)(createStore)(
      combineReducers({}),
        (localStorage['redux-store']) ?
            JSON.parse(localStorage['redux-store']) :
            initialState,
        thunk,
  );

export default storeFactory;
