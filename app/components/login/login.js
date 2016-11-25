import React, { PropTypes, Component, ReactDom } from 'react';
import FacebookLogin from 'react-facebook-login';
import GoogleLogin from 'react-google-login';
import {asteroid} from '../../asteroid'

import { Link, Router, browserHistory } from 'react-router'

class GoogleLoginView extends Component {
  render(){
    return (
      <GoogleLogin
        clientId="500871646789-sutbet90ovo14nub4f2l190ck6u93cgc.apps.googleusercontent.com"
        buttonText="Login"
        onSuccess={(response) => {
            response['services'] = 'google';
            response['job'] = '';
            response['friendList'] = [];
            this.props.onLoginGG(response);
          }
        }
        onFailure={(response) => {}}
        />
    )
  }
}

GoogleLoginView.PropTypes ={
  onLoginGG: PropTypes.func.isRequired
}

class FacebookLoginView extends Component {
  render(){
    return (
      <FacebookLogin
        appId="1055517184541707"
        autoLoad={false}
        fields="name,email,picture"
        callback={(response) => {
            response['services'] = 'facebook';
            response['job'] = '';
            response['friendList'] = [];
            this.props.onLoginFB(response);
          }
        }
        cssClass="my-facebook-button-class"
        />
    )
  }
}

FacebookLoginView.PropTypes ={
  onLoginFB: PropTypes.func.isRequired
}

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.email = {};
    this.password = {};
  }

  render() {
    return (
      <div className="login-title">
          <h2 style={{marginLeft:'40%', color: 'white'}}>Đăng nhập</h2>
          <br/>
          <div className="row login-form">
            <div className='col-md-3' style={{width: '50%', borderRight: '1px solid white', paddingRight: '25px'}}>

              <input className="form-control" type="text" style={{
                width: '100%',
                backgroundColor: '#10c86a',
                borderColor: 'white'
              }} ref={node => {
                this.email = node
              }} />

              <input className="form-control" type="password" style={{
                  width: '100%',
                  backgroundColor: '#10c86a',
                  borderColor: 'white'
                }} ref={node => {
                  this.password = node
              }} />

            <button className="btn btn-default" style={{fontWeight: 'bold', color: '#10c86a', width: '100%'}} onClick= {e => {
                    e.preventDefault();
                    asteroid.loginWithPassword({email:this.email.value,password:this.password.value}).then((res) => {
                      let localToken = localStorage.getItem("ws://localhost:3000/websocket__login_token__");
                      if(localToken){
                        localStorage.setItem('Meteor.loginToken',localToken)
                      }
                      this.props.onLogin(localStorage.getItem('Meteor.loginToken'));
                    }).catch((err) => {console.log(err);})
                  }
                }>Đăng Nhập</button>

            </div>

            <div className="col-md-3" style={{width: '50%',  paddingLeft: '25px'}}>
              <p style={{color: 'white', fontSize: '15px'}}>Hoặc đăng nhập với</p>

              <div id="google-login">
                <GoogleLoginView onLoginGG={this.props.onLoginGG}/>
              </div>

              <div id="facebook-login">
                <FacebookLoginView onLoginFB={this.props.onLoginFB}/>
              </div>

            </div>
          </div>
      </div>
    )
  }
}

Login.PropTypes = {
  onLogin: PropTypes.func.isRequired,
  onLoginFB: PropTypes.func.isRequired,
  onLoginGG: PropTypes.func.isRequired,
}
