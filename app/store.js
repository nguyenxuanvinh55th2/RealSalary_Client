import rootReducer from './reducers';
import { client } from './apollo-client.js';
import { createStore, compose, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import {routerReducer, syncHistoryWithStore} from 'react-router-redux'
import { browserHistory} from 'react-router'

const defaultState = {
  account: false,
  salary:0
}

const store = createStore(
  rootReducer,
  defaultState,
  applyMiddleware(thunk),
  compose(
      window.devToolsExtension ? window.devToolsExtension(): f => f
  ));
  if(module.hot){
    module.hot.accept(() => {
      const nextRootReducer = require('./reducers/index').default;
      store.replaceReducer(nextRootReducer);
    })
  }

export const history = syncHistoryWithStore(browserHistory, store);
export default store;
