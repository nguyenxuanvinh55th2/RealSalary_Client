import React, { PropTypes, Component } from 'react'
import { Link, Router, browserHistory } from 'react-router'
import ReactDOM from 'react-dom'

export default class CommentItem extends Component {
  constructor(props) {
    super(props)
  }

  renderDeleteButton(userId) {
    return (
      <button className="btn btn-primary" onClick={e => {
          this.props.deleteComment(this.props.commentId, userId);
        }} style={{height: '25px', width: '25px'}} src={this.props.image}>
        X
      </button>
    )
  }

  render() {
    let userId;
    try {
      userId = JSON.parse(localStorage.getItem("userInfo"))._id;
    }
      catch(err) {
        userId = '';
      }
    return (
      <div className="row" style={{marginBottom: '20px'}}>
          <div className="col-md-1">
            <img style={{height: '25px', width: '25px'}} src={this.props.image}/>
          </div>
          <div className="col-md-9" style={{marginLeft: '-10px'}}>
            <div className="row" style={{marginLeft: '0px'}}>
              <p>
                <b>{this.props.name}</b>
              </p>
            </div>
            <div className="row" style={{marginLeft: '0px', marginTop: '-10px'}}>
              <p>{this.props.text}</p>
            </div>
          </div>
          <div className="col-md-1">
            { userId === this.props.userId ? this.renderDeleteButton(userId) : null }
          </div>
      </div>
    )
  }

}

CommentItem.PropTypes = {
  commentId: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  deleteComment: PropTypes.func.isRequired
}
