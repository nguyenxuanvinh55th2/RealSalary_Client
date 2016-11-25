import React, { Component, PropTypes } from 'react';

//import { Meteor } from 'metor/meteor';
import { connect } from 'react-redux';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import { Link, Router, browserHistory } from 'react-router';
//import { search } from '../action/actionCreator.js';

import Header from '../components/header/header.js';
import { logout } from '../action/actionCreator.js'

//Meteor.subscribe("user");

const NOTIFICATION = gql`
  query notification($userId: String){
    notification(userId: $userId) {
      _id
    	userId
    	sendId
    	sender {
        _id
        name
        image
      }
    	note
    	date
      read
    },
  }`

const READ_NOTIFICATION = gql`
  mutation readNotification($userId: String) {
    readNotification(userId: $userId)
  }
`;

const MapMutationToProps = graphql (
  READ_NOTIFICATION, {
    props: ({ mutate }) => ({
      read: (userId) => mutate({ variables: { userId } }),
    }),
  }
)

const mapDataToProps = graphql(
  NOTIFICATION,
  {
    options: () => {
      let userId;
      try {
        userId = JSON.parse(localStorage.getItem("userInfo"))._id;
      }
        catch(err) {
          userId = '';
        }
      return {
        variables: {
          userId: userId
        }
      }
    }
  }
);

const NotificationData = mapDataToProps(MapMutationToProps(Header));

const HeaderContain = connect(
  (state) => ({ userInfo: state.account }),
  (dispatch) => ({
    onLogout: () => {
      dispatch(logout())
    },
    // search: (keyWord) => {
    //   dispatch(search(keyWord))
    // }
  }),
)(NotificationData);

export default HeaderContain
