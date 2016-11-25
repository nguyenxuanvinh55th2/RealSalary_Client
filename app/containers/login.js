import React, { Component, PropTypes } from 'react';

import { connect } from 'react-redux';

import { Link, Router, browserHistory } from 'react-router'

import Login from '../components/login/login.js';
import { login } from '../action/actionCreator.js'
import { loginFB } from '../action/actionCreator.js'
import { loginGG } from '../action/actionCreator.js'

const mapStateToProps = (state) => {
  return {
    state
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
      onLogin: (email, password) => {
        dispatch(login(email, password))
      },

      onLoginFB: (userInfo) => {
        dispatch(loginFB(userInfo))
      },

      onLoginGG: (userInfo) => {
        dispatch(loginGG(userInfo))
      },
  }
}


// function generateMutationObject(productId) {
//   return {
//     mutation: gql`
//     mutation removeProductFromCart($productId: String) {
//      removeFromCart(productId: $productId) {
//       items
//      }
//     }`,
//     variables: {
//       productId
//     }
//   };
// }
//
//
// function mapQueriesToProps() {
//   return {
//     cartData: {
//       query: gql`
//           {
//             cart {
//              products {
//                 id
//                 title
//                 description
//                 price
//              }
//              quantity
//              productQuantity {
//                 id
//                 quantity
//              }
//             }
//           }
//         `,
//       forceFetch: true
//     }
//   };
// }
//
// function mapMutationsToProps() {
//   return {
//     removeFromCart: generateMutationObject
//   };
// }

const Account = connect(
  mapStateToProps,
  mapDispatchToProps
)(Login)

export default Account
