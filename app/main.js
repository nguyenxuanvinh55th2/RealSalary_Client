var React = require('react');
var ReactDOM = require('react-dom');
import {Router, Route, IndexRoute} from 'react-router'
import store,{history} from './store'
import App from './components/app'
import CommentPage from './components/commentPage/commentPage'
import PostList from './components/post'
import Register from './components/register'
import Account from './containers/login.js'
import CommentPageContain from './containers/commentPageContain.js'
import BargeSalary from './components/salary'
import Ship from './components/ship'
import {client} from './apollo-client'
import { ApolloProvider } from 'react-apollo';
import './main.less'
import FacebookLogin from 'react-facebook-login';
import GoogleLogin from 'react-google-login';

ReactDOM.render(
  <ApolloProvider store={store} client={client}>
    <Router history={history}>
      <Route path="/" component={App}>
        <IndexRoute component={BargeSalary}/>
        <Route path="/commentPage/:info" component={CommentPageContain}/>
        <Route path="/register" component={Register}/>
        <Route path="/login" component={Account}/>
        {/* <Route path="/salary/:id" component={BargeSalary}></Route> */}
      </Route>
    </Router>
  </ApolloProvider>
, document.getElementById('root'));
