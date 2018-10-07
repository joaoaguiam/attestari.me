import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

import { Provider } from 'react-redux'
import thunk from 'redux-thunk';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import * as reducers from './store/reducers';

const initStore = (reducer, initialState) => {
  if (typeof window === 'undefined') {
    return createStore(combineReducers(reducers), composeWithDevTools(applyMiddleware(thunk)));
  } else {
    if (!window.store) {
      window.store = createStore(combineReducers(reducers), composeWithDevTools(applyMiddleware(thunk)));
    }
    return window.store
  }
}
const store = initStore();


ReactDOM.render((
  <Provider store={store}>
    <App />
  </Provider>
),
  document.getElementById('root')
)
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();