import { combineReducers } from 'redux';
import account from './account';
import salary from './salary'
import { client } from '../apollo-client.js';

import { routerReducer} from 'react-router-redux'

const rootReducer = combineReducers({
  account,
  salary,
  routing: routerReducer,
  apollo: client.reducer(),
})

export default rootReducer;
