import React, { PropTypes, Component } from 'react'
import { Link, Router, browserHistory } from 'react-router'
import ReactDOM from 'react-dom'
import {compose ,graphql} from 'react-apollo'
import gql from 'graphql-tag';

import { encrypted } from '../aesCrypt'

class UserMenu extends React.Component {
  render() {
    return (
      <div className="row" style={{marginLeft: '-8px', marginTop: '10px', marginBottom: '10px'}}>
        <div className="col-md-1">
            <img style={{width: '40px', height: '40px'}} src={ this.props.image }></img>
        </div>
        <div className="col-md-8">
            <h4 style={{width: '100%', marginLeft: '10px'}}><b>{ this.props.name }</b></h4>
        </div>
      </div>
    )
  }
}

UserMenu.PropTypes = {
  userId: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
}

class PostItem extends React.Component {
  constructor(props){
    super(props)
    this.state={"vote":''}
  }

  renderDeleteButton(userId) {
    return (
      <button className="btn btn-primary" onClick={e => {
          this.props.deletePost(userId, this.props.post._id);
        }} style={{height: '25px', width: '25px'}} src={this.props.image}>
        X
      </button>
    )
  }

  render(){
    let postInfo = JSON.stringify({
      postId: this.props.post._id,
      userId: this.props.userInfo._id,
      userName: this.props.userInfo.name,
      userImage: this.props.userInfo.image,
      image: this.props.post.display_src,
    })

    let encryptedString = encrypted(postInfo);
    let userId;
    try {
      userId = JSON.parse(localStorage.getItem("userInfo"))._id;
    }
      catch(err) {
        userId = '';
      }

    return (
      <div style={{float: "left", margin:"10px",minWidth: "30%",maxWidth:"31%",boxShadow:'0 4px 8px 0 rgba(0,0,0,0.2)',transition:'0.3s'}}>
        <div className="row">
          <div className="col-md-10">
            <UserMenu userId={this.props.userInfo._id} name={this.props.userInfo.name} image={this.props.userInfo.image}/>
          </div>
          <div className="col-md-1">
            { this.props.post.userId === userId ? this.renderDeleteButton(userId) : null }
          </div>
        </div>
        <img src={this.props.post.display_src} alt="Avartar" style={{width:'100%'}}></img>
        <div style={{padding:'2px 16px'}}>
          <h4>{this.props.post.caption}</h4>
          <div style={{display:"flex",justifyContent: "space-between"}}>
            <button className="btn btn-lg " type="button"  onClick={(e)=>this.props.updateLike(userId, this.props.post._id)} >Likes {this.props.post.likes}</button>
            <a className="btn btn-lg " href={"/commentPage/" + encryptedString}>Comments {this.props.post.commentsCount}</a>
          </div>
        </div>
      </div>
    )
  }
}

PostItem.PropTypes = {
  userInfo: PropTypes.string.isRequired,
  post: PropTypes.object.isRequired,
  updateLike: PropTypes.func.isRequired,
  deletePost: PropTypes.func.isRequired,
}

const UPDATE_LIKE_POST =gql`
  mutation updateLikePost($userId: String, $postId:String){
    updateLikePost(userId: $userId, postId:$postId),
  }
`
const updatelikePost = graphql(UPDATE_LIKE_POST,
{
  props:({mutate})=>({
    updateLike : (userId, postId) =>mutate({variables:{userId, postId}})
  })
});

const DELETE_POST = gql`
  mutation deletePost($userId: String, $postId:String){
    deletePost(userId: $userId, postId:$postId)
  }
`
const deletepost = graphql(DELETE_POST,{
  props:({mutate})=>({
    deletePost : (userId, postId) =>mutate({variables:{userId, postId}})
  })
})

export default compose(
  updatelikePost,
  deletepost
)(PostItem)
