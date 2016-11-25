import React,{PropTypes} from 'react'
import ReactDOM from 'react-dom'
import store from '../store'
import {compose ,graphql} from 'react-apollo'
import gql from 'graphql-tag';
import PostItem from './postItem'
import update from 'react-addons-update';
import { asteroid } from '../asteroid';
import { Link, Router, browserHistory } from 'react-router'
const SUBSCRIBE_POST =gql `
  subscription subscriptPost {
    subscriptPost {
      _id
      caption
      likes
      display_src
      commentsCount
      userId
      user {
        _id
        name
        image
      }
    }
  }`

class PostList extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      caption:" ",
      link:" ",
      image: null
    }
      this.subscription = null;
  }

  componentWillReceiveProps(nextProps) {
  if(!this.subscription && !nextProps.loading){
    this.subscription = nextProps.subscribeToMore({
      document:SUBSCRIBE_POST,
      variables:{},
      updateQuery :(previousResult,{subscriptionData}) =>{
            console.log("subscriptionData",subscriptionData);
        let newPost = subscriptionData.data.subscriptPost;
        let newResult = previousResult;
        console.log("newPost",newPost,"previousResult",previousResult);

          newResult.posts.forEach((item,index) => {
            if(item._id === newPost._id)
              if(item.likes !== newPost.likes)
                item.likes = newPost.likes
                else if (item.commentsCount !== newPost.commentsCount && item.count !== null && newPost.commentsCount !==null) {
                  item.commentsCount = newPost.commentsCount;
                }
                else {
                    newResult.posts.splice(index, 1)
                }
          })
        return newResult;
      }
    })
  }
}

  insertPost(event) {
    event.preventDefault();
    let userId;
    try {
      userId = JSON.parse(localStorage.getItem("userInfo"))._id;
      let element = document.getElementById('imageInput');
      let image = element ? element.files[0] : {};
      console.log("image abc def", image);
      var reader = new FileReader();
      reader.onload = function(fileLoadEvent) {
        //  Meteor.call('file-upload', file, reader.result);
         asteroid.call('insertImage', file, reader.result);
      };
      reader.readAsBinaryString(file);
      //this.props.insertPost(this.state.caption, userId, );
      this.setState({caption:" "});
      this.setState({link:" "});
      this.setState({image: null})
      this.props.refetchPost();
    }
      catch(err) {
        console.log("rerror", err);
        userId = '';
      }
  }


  renderPost(){
    if(this.props.loading || !this.props.posts)
      return (<div  className="spinner spinner-lg"></div>)
    else {
      return (<div style={{padding:'10px'}} >
        {this.props.posts.map((post,idx)=><PostItem {...this.props} key={idx} index={idx} post={post} userInfo={post.user}></PostItem>)}
      </div>)
    }
  }
  render(){
      console.log("posts",this.props.posts);
    return (
      <div>
        <div className="row" style={{marginLeft: '0px'}}>
          {this.renderPost()}
          <div>
            <button style={{position:"fixed" ,  bottom:"15px" , right:"25px" }} className="btn btn-primary btn-lg" data-toggle="modal" data-target="#myModalAddPost" onClick={e => {
                document.getElementById('myModalAddPost').style.display = 'inline';
              }}><span className="pficon-add-circle-o"></span></button>
            <div className="modal fade" id="myModalAddPost" tabIndex={-1} role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <button type="button" className="close" data-dismiss="modal" aria-hidden="true">
                      <span className="pficon pficon-close"></span>
                    </button>
                    <h4 className="modal-title" id="myModalLabel">Thêm bài viết mới</h4>
                  </div>
                  <div className="modal-body">
                    <form className="form-horizontal">
                      <div className="form-group">
                        <label className="col-sm-3 control-label" htmlFor="textInput2-modal-markup">Mô tả</label>
                        <div className="col-sm-9">
                          <input type="text" value={this.state.caption} onChange={({target})=>this.setState({caption:target.value})} className="form-control"/>
                        </div>
                      </div>
                      <div className="form-group">
                        <label className="col-sm-3 control-label" htmlFor="textInput3-modal-markup">Link hình ảnh</label>
                        <div className="col-sm-9">
                          <span className="btn btn-default btn-file">
                            Hình ảnh<input id="imageInput" type="file" accept="image/*" ref="image"/>
                          </span>
                        </div>
                      </div>
                    </form>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-default" data-dismiss="modal">Cancel</button>
                    <button type="button" className="btn btn-primary" onClick={this.insertPost.bind(this)}>Save</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row" style={{marginLeft: '0px', height: '50px'}}>
          <div className="col-md-offset-5">
            <a onClick={this.props.loadMoreEntries}>Load more</a>
          </div>
        </div>
      </div>
    )
  }
}

PostList.PropTypes = {
  posts: PropTypes.array.isRequire,
  insertPost: PropTypes.func.isRequire,
}




const GET_POST = gql`
  query getPost($offset: Int, $limit: Int) {
    posts(offset: $offset, limit: $limit) {
      _id
      caption
      likes
      display_src
      userId
      user {
        _id
        name
        image
      }
      commentsCount
    }
  }
`

const ITEMS_PER_PAGE = 3;

const mapdataPost = graphql(
  GET_POST,
  {
    options: { variables: {offset: 0, limit: ITEMS_PER_PAGE}, forceFetch: true},
    props: ({ ownProps, data: { loading, posts, refetch ,subscribeToMore, fetchMore} }) => ({
     postLoading: loading,
     posts: posts,
     refetchPost: refetch,
     subscribeToMore:subscribeToMore,
     loadMoreEntries() {
        return fetchMore({
          // query: ... (you can specify a different query. FEED_QUERY is used by default)
          variables: {
            // We are able to figure out which offset to use because it matches
            // the feed length, but we could also use state, or the previous
            // variables to calculate this (see the cursor example below)
            offset: posts.length,
          },
          updateQuery: (previousResult, { fetchMoreResult }) => {
            if (!fetchMoreResult.data) { return previousResult; }
            return Object.assign({}, previousResult, {
              // Append the new feed results to the old one
              posts: [...previousResult.posts, ...fetchMoreResult.data.posts],
            });
          },
        });
      },
    }),
  }
)

const ADD_POST = gql`
  mutation insertPost($caption: String, $userId: String, $lastModified: String, $lastModifiedDate: String, $name: String, $size: Int, $type: String, $webkitRelativePath: String){
    insertPost(caption: $caption, userId: $userId, lastModified: $lastModified, lastModifiedDate: $lastModifiedDate, name: $name, size: $size, type: $type, webkitRelativePath: $webkitRelativePath)
  }
`
const insertPost = graphql(ADD_POST,
  {
    props:({mutate})=>({
      insertPost : (caption, userId, lastModified, lastModifiedDate, name, size, type, webkitRelativePath) => mutate({variables:{caption, userId, lastModified, lastModifiedDate, name, size, type, webkitRelativePath}})
    })
  }
);

export default compose(
mapdataPost,
insertPost,
)(PostList)
