import React, { PropTypes, Component } from 'react'
import { Link, Router, browserHistory } from 'react-router'
import ReactDOM from 'react-dom'
import gql from 'graphql-tag';
import Notification from '../notification/notification.js'

class UserImage extends Component {
  render() {
    if(this.props.userImage) {
      return (
        <div className='form-group' style={{marginLeft: '20px'}}>
          <button className="btn btn-default header-button" onClick={e =>{
              document.getElementById('userMenu').style.display = 'inline';
            }}>
            <img id='userButton' className="login-image" src={ this.props.userImage } />
          </button>
        </div>
      )
    } else {
        return null;
      }
  }
}

UserImage.PropTypes = {
  userImage: PropTypes.string.isRequired,
}

class NoteNotificate extends Component {
  render() {
    if(!this.props.show) {
      return (
        <div></div>
      )
    } else {
      return (
        <div className="noteNotificate">{ this.props.number }</div>
      )
    }
  }
}

NoteNotificate.PropTypes = {
  show: PropTypes.bool.isRequired,
  number: PropTypes.number.isRequired,
}

class UserMenu extends Component {
  render() {
    if(this.props.userId && this.props.name && this.props.image) {
      return (
        <div id="userMenu">
          <div className="row" style={{marginBottom: '18px'}} onClick={e => {
              document.getElementById('userMenu').style.display = 'inline';
            }}>
            <div className="col-md-5">
                <img style={{width: '80px', height: '80px'}} src={ this.props.image }></img>
            </div>
            <div className="col-md-7">
                <h4 style={{width: '100%'}}><b>{ this.props.name }</b></h4>
            </div>
          </div>
          <div className="row">
            <div className="col-md-7">
              <Link to={"/profile/" + this.props.userId + "/wall" } className="btn btn-success" onClick={e => {
                  document.getElementById('userMenu').style.display = 'none';
                }}>
                Trang cá nhân
              </Link>
            </div>
            <div className="col-md-5">
              <button className="btn btn-primary" onClick={e => {
                  this.props.onLogout();
                  document.getElementById('userMenu').style.display = 'none';
                  browserHistory.push('/');
                }}>Đăng xuất</button>
            </div>
          </div>
        </div>
      )
    } else {
        return null;
      }
  }
}

UserMenu.PropTypes = {
  userId: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  onLogout: PropTypes.func.isRequired
}

const buttonStyle = {
  backgroundColor: 'inherit',
  backgroundImage: 'url("")',
  border: 'none',
  marginLeft: '20px'
}

const fontStyle = {
  fontSize: '16px',
  color: 'white'
}

const isDuplicateComment = (newItem, existing) => {
  return newItem._id !== null && existing.some(item => newItem._id === item._id);
}

export default class Header extends Component {
  constructor(props) {
      super(props);
      this.keyWord = {
        value: null
      };
      this.subscription = null;
      this.state = {userId: null, name: '', image: ''};
  }

  componentWillReceiveProps(nextProps) {

    if(localStorage.getItem("userInfo") || nextProps.userInfo) {
      let userInfo = JSON.parse(localStorage.getItem("userInfo"));
      console.log(userInfo);
      let userId = userInfo._id;
      this.setState({userId});
      let name = userInfo.profileObj? userInfo.profileObj.name : userInfo.name;
      this.setState({name});
      let image = userInfo.profileObj? userInfo.profileObj.imageUrl : userInfo.picture.data.url;
      this.setState({image});
    } else {
        this.setState({userId: null});
        this.setState({name: ''});
        this.setState({image: ''});
      }


    var parent = this;
    // console.log("parent post", parent.userId);

    if (!this.subscription && !nextProps.loading) {
      this.subscription = this.props.data.subscribeToMore({
        document: SUBSCRIBE_NOTIFICATION,

        //variables chứa giá trị để thực hiện filter khi subscribe dữ liệu
        variables: { note: this.state.userId },

        //sau khi thực hiện mutation, subscription sẽ ghi nhận dữ liệu mới
        //và trả về , dữ liệu mới đó lúc này sẽ được lưu trử trong subscriptionData,
        //previousResult chứa danh sách dữ liệu cũ trước khi mutation
        updateQuery: (previousResult, { subscriptionData }) => {

          //gán newTask bằng dữ liệu sau khi mutation cụ thể là một task trong,
          //danh sách sau khi thực hiện insert, update hoặc delete
          const newNotification = subscriptionData.data.newNotification;


          //gán newResult bằng previousResult
          let newResult = previousResult;

          if (isDuplicateComment(newNotification, previousResult.notification)) {
            newResult.notification.forEach(item =>{
              if(item._id === newNotification._id)
                newResult.notification.splice(item, 1)
            })
          } else {
              newResult.notification.push(newNotification);
            }


          //kiểm tra trùng task thông qua _id của task mới
          //nếu task đó đã tồn tại ta tiến hành chỉnh sửa (lệnh update) hoặc xóa
          //(lệnh delete), nếu không ta tiến hành thêm mới vào newResult

          //trả  về newResult
          return newResult;
        },
      });
    }
  }

  renderNotificateIcon(){
    var number = 0;
    var show = false;
    if(this.props.data && !this.props.data.loading) {
      number = this.props.data.notification.filter(note => !note.read).length;
      if(number > 0)
        show = true
    }
    return (<NoteNotificate show={ show } number={ number }/>)
  }

  render() {
      // console.log("user Info", this.props.userInfo);
      return (
        <div style={{width:'100%'}}>
          <div style={{width:'100%'}} className="header">
            <Notification noteList={ this.props.data }/>
            <UserMenu image={ this.state.image } name={ this.state.name } userId={ this.state.userId } onLogout={ this.props.onLogout }/>
            <form className="row" style={{width:'100%'}} onSubmit ={e => {
                e.preventDefault();
              }}>

              <div className="col-md-1">
                <Link to="/" className="btn btn-default" style={buttonStyle}>
                  <span style={fontStyle}>Home</span>
                </Link>
              </div>

              <div className="col-md-1">
                <Link to="/" className="btn btn-default" style={buttonStyle}>
                  <span style={fontStyle}>Something</span>
                </Link>
              </div>

              <div className="col-md-5"  style={{width: '60%', marginLeft: '20px'}}>
                <div className="input-group" style={{width: '100%', marginTop: '5px'}}>
                  <input className="form-control" type="text" ref={node => this.keyWord=node}/>
                  <span className="input-group-addon glyphicon glyphicon-search" style={{width: '20px'}}></span>
                </div>
              </div>

              <div className="col-md-1" style={{marginLeft: '20px'}}>
                <button className="btn btn-default" style={{backgroundColor: 'inherit', backgroundImage: 'url("")', border: 'none',}}
                  onClick = {e => {
                    document.getElementById('notification').style.display = 'inline';
                    this.props.read(this.userId);
                    this.props.data.refetch();
                }}>
                  { this.renderNotificateIcon() }
                  <span id="notificationButton" style={fontStyle}>Thông báo</span>
                </button>
              </div>

              <UserImage userImage={this.state.image}/> : null

            </form>
          </div>
        </div>
      )
    }
}

Header.PropTypes = {
  data: PropTypes.object.isRequired,
  onLogout: PropTypes.func.isRequired,
  read: PropTypes.func.isRequired,
  userInfo: PropTypes.object.isRequired
  // search: PropTypes.object.isRequired,
}

const SUBSCRIBE_NOTIFICATION = gql`
  subscription newNotification($note: String) {
    newNotification(note: $note) {
      _id,
    	userId,
    	sendId,
      sender {
        _id
        name
        image
      },
    	note,
    	date,
      read
    }
  }`
