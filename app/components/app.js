import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import * as actionCreator from "../action/actionCreator"
import React from 'react'
import HeaderContain from '../containers/header.js';

function mapStateToProps(state){
  return {
      isLogin:state.login,
      salary:state.salary
  }
}

function mapDispathToProps(dispatch) {
  return bindActionCreators(actionCreator, dispatch);
}

class Main extends React.Component {
  render(){
    return (
      <div>
        {/* <div>
          <HeaderContain/>
        </div> */}
        <div  style={{marginTop: '39px'}}>
          {React.cloneElement(this.props.children, this.props)}
        </div>
      </div>
    )
  }
}

const App = connect (mapStateToProps,mapDispathToProps)(Main);

export default App;
