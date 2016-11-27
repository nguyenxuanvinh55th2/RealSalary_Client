import React,{PropTypes} from 'react'
import ReactDOM from 'react-dom'
import store from '../store'
import {compose ,graphql} from 'react-apollo'
import gql from 'graphql-tag';
import { Link, Router, browserHistory } from 'react-router'
class Ship extends React.Component {
  constructor(props) {
    super(props)
  }
  renderShip(){
    if(this.props.listship.loading || !this.props.listship)
      return (<div  className="spinner spinner-lg"></div>)
    else {
      return (
            this.props.listship.ships.map((item,idx) => {
              return(
                  <div key={idx+item._id} style={{display: "inline"}}>
                    <p>{item.description}</p>
                    <Link style={{padingLeft:'30px'}} className="btn btn-success" to={"/salary/"+item._id}>Tinh luong</Link>
                  </div>
              )
            })
      )
    }
  }
  render(){
    return(
      <div style={{padding:'10px'}}>
        {
          this.renderShip()
        }
      </div>
    )
  }
}
const GETSALARYMEMBER = gql`
  query getShips {
    ships {
    _id
    description
  }
  }
`;
const mapdataShip = graphql(
  GETSALARYMEMBER,
  {
    name: 'listship'
  }
)
export default compose(
  mapdataShip
)(Ship)
