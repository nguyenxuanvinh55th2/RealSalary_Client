import React, { PropTypes, Component } from 'react'
import { Link, Router, browserHistory } from 'react-router'
import ReactDOM from 'react-dom'
import gql from 'graphql-tag';
import { decrypted } from '../../aesCrypt'

import CommentItemContain from '../../containers/commentItemContain'

function isDuplicateComment(newItem, existing) {
  return newItem._id !== null && existing.some(item => newItem._id === item._id);
}

export default class CommentPage extends Component {
  constructor(props) {
    super(props);
    this.state = ({text: ''});
  }

  componentWillReceiveProps(nextProps) {
    // we don't resubscribe on changed props, because it never happens in our app
    if (!this.subscription && !nextProps.loading) {
      this.subscription = this.props.subscribeToMore({
        document: SUBSCRIBE_COMMENTS,

        //variables chứa giá trị để thực hiện filter khi subscribe dữ liệu
        variables: { comment: "" },

        //sau khi thực hiện mutation, subscription sẽ ghi nhận dữ liệu mới
        //và trả về , dữ liệu mới đó lúc này sẽ được lưu trử trong subscriptionData,
        //previousResult chứa danh sách dữ liệu cũ trước khi mutation
        updateQuery: (previousResult, { subscriptionData }) => {

          //gán newTask bằng dữ liệu sau khi mutation cụ thể là một task trong,
          //danh sách sau khi thực hiện insert, update hoặc delete
          const newComment = subscriptionData.data.newComment;
          console.log("new Comment", newComment);
          console.log("previousResult", previousResult);



          //gán newResult bằng previousResult
          let newResult = previousResult;

          //kiểm tra trùng task thông qua _id của task mới
          //nếu task đó đã tồn tại ta tiến hành chỉnh sửa (lệnh update) hoặc xóa
          //(lệnh delete), nếu không ta tiến hành thêm mới vào newResult
          if (isDuplicateComment(newComment, previousResult.comments)) {
            newResult.comments.forEach(item =>{
              if(item._id === newComment._id)
                if(item.checked !== newComment.checked)
                  item.checked = newComment.checked;
                else
                  newResult.comments.splice(item, 1)
            })
          } else {
              newResult.comments.push(newComment);
            }

          //trả  về newResult
          return newResult;
        },
      });
    }
  }

  renderComment() {
    if(!this.props.comments || this.props.loading){
      return (<div className="spinner spinner-lg"></div>)
    } else {
        return this.props.comments.map((item, idx) => (
          <CommentItemContain key={idx} commentId={item._id} userId={item.userId} name={item.user.name} image={item.user.image} text={item.text}/>
        ))
      }
  }

  render(){
    let decryptedString = decrypted(this.props.params.info);
    let info = JSON.parse(decryptedString);
    let userInfo = JSON.parse(localStorage.getItem("userInfo"));
    let image;
    let userId;
    let postId = info.postId;
    if(userInfo) {
      image = userInfo.profileObj? userInfo.profileObj.imageUrl : userInfo.picture.data.url;
      userId = userInfo._id;
    }

    return (
      <div className="row col-md-10 col-md-offset-1" style={{boxShadow:'0 4px 8px 0 rgba(0,0,0,0.2)',transition:'0.3s', marginTop: '20px', height: '87vh'}}>
        <div className="col-md-6" style={{height: '92%', marginTop: '23px'}}>
          <img src={info.image} style={{width: '100%', height: '100%', marginLeft: '-15px'}}/>
        </div>
        <div className="col-md-6" style={{height: '92%', marginTop: '23px'}}>
          <div style={{width: '100%'}}>
            <h2 className="col-md-offset-4"><b>Bình luận</b></h2>
          </div>
          <div style={{width: '100%', height: '85%', overflow: 'scroll', overflowX: 'hidden'}}>
            {this.renderComment()}
            <a onClick={this.props.loadMoreEntries}>Load more</a>
          </div>
          <div className="form-group row" style={{height: '5%', width: '100%'}}>
            <div className="col-md-1">
              <img style={{height: '25px', width: '25px'}} src={image}/>
            </div>
            <div className="col-md-10" style={{height: '100%'}}>
              <textarea style={{height: '100%', width: '100%'}} className="form-control" rows="2" id="comment" ref="text">
              </textarea>
            </div>
            <div className="col-md-1">
              <button className="btn btn-primary" style={{height: '25px', width: '35px', marginLeft: '-21px'}} onClick={e => {
                  let text = ReactDOM.findDOMNode(this.refs.text).value;
                  this.props.insertComment(text, userId, postId)
                }}>Gửi</button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

CommentPage.PropTypes = {
  loading: PropTypes.bool.isRequired,
  comments: PropTypes.array.isRequired,
  subscribeToMore: PropTypes.func.isRequired
}

const SUBSCRIBE_COMMENTS = gql`
  subscription newComment($comment: String) {
    newComment(comment: $comment) {
      _id
      text
      userId
      user {
        _id
        name
        image
      }
    }
  }`
