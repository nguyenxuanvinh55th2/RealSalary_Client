import React, { PropTypes, Component, ReactDom } from 'react';
import { Link, Router, browserHistory } from 'react-router'
import { graphql } from 'react-apollo';

import gql from 'graphql-tag';

//Meteor.subscribe("user");
class Note extends Component {
  render() {
    console.log(this.props.remove);
    return (
      <div className="row" style={{borderBottom: '1px solid gray', paddingTop: '10px', paddingBottom: '8px', width: '285px', marginLeft: '0px'}} onClick={e => {
          document.getElementById('notification').style.display = 'inline';
        }}>
        <div className="col-md-3">
            <img className="img-note" src={ this.props.note.sender.image }></img>
        </div>
        <div className="col-md-6">
          <span style={{width: '100%', height: '100%'}}>
            <h5><b>{ this.props.note.sender.name }</b></h5>
            <p>{this.props.note.note}</p>
            <p>{this.props.note.date}</p>
          </span>
        </div>
        <div className="col-md-3">
          <div style={{position: 'absolute', top: '0px', right: '10px'}}>
            <button style={{float: 'right'}} onClick = { e => {
                this.props.remove(this.props.note._id)
            }}>X</button>
          </div>
        </div>
      </div>
    )
  }
}

Note.PropTypes = {
  note: PropTypes.object.isRequired,
  remove: PropTypes.func.isRequired
}

export default class Notification extends Component {
  constructor(props) {
      super(props);
  }

  renderNote() {
    if(!this.props.noteList || this.props.noteList.loading) {
      return (
        <div>loading</div>
      )
    } else
        if(this.props.noteList.notification.length === 0) {
          return (
            <div style={{marginTop: '20px', marginLeft: '55px'}}>bạn không có thông báo nào</div>
          )
        } else {
            return this.props.noteList.notification.map((note, idx) => (
              <NoteContainer key={idx} note={note}/>
            ))
          }
  }

  render() {
    console.log(this.props.noteList);
    return (
      <div id="notification" onClick={e => {

        }}>
        {this.renderNote()}
      </div>
    )
  }
}

Notification.PropTypes = {
  noteList: PropTypes.object.isRequired,
}

const DELETE_NOTIFICATION = gql`
  mutation deleteNotification($noteId: String) {
    deleteNotification(noteId: $noteId)
  }
`;

const NoteContainer = graphql(
  DELETE_NOTIFICATION,
  {
    props: ({ mutate }) => ({
      remove: (noteId) => mutate({ variables: { noteId } }),
    }),
  }
)(Note);
