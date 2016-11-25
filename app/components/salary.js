import __ from 'lodash'
import React,{PropTypes} from 'react'
import ReactDOM from 'react-dom'
import store from '../store'
import {compose ,graphql} from 'react-apollo'
import gql from 'graphql-tag';
import { Link, Router, browserHistory } from 'react-router'
class Detail extends React.Component {
  constructor(props) {
    super(props)
    this.total =0;
  }
   renderTT(){
     let listtr =[], firstAc = {};
     __.forEach(this.props.barge.barges,(i,idx)=>{
       if(i.activities && i.activities.length>=0)
       {
         firstAc = i.activities[0];
        this.total = this.total + firstAc.total;
         listtr.push((<tr key={i._id}>
           <td rowSpan={i.activities.length}>{i._id}</td>
           <td rowSpan={i.activities.length}>{i.product}</td>
           <td rowSpan={i.activities.length}>{i.dateStart}</td>
           <td rowSpan={i.activities.length}>{i.dateEnd}</td>
           <td rowSpan={i.activities.length}>{i.coefficientBarge}</td>
           <td>{firstAc.statusName}</td>
           <td>{firstAc.dateStart}</td>
           <td>{firstAc.dateEnd}</td>
           <td>{firstAc.totalDate}</td>
           <td>{firstAc.statusSalary}</td>
           <td>{firstAc.coefficientPosition}</td>
           <td>{firstAc.total}</td>
           </tr>
         ));
         __.forEach(i.activities.slice(1),(ac)=>{
           this.total = this.total + ac.total;
           listtr.push((<tr key={i._id+this.total}>
             <td>{ac.statusName}</td>
             <td>{ac.dateStart}</td>
             <td>{ac.dateEnd}</td>
             <td>{ac.totalDate}</td>
             <td>{ac.statusSalary}</td>
             <td>{ac.coefficientPosition}</td>
             <td>{ac.total}</td>
           </tr>))
         })
       }
     })
     return listtr
   }
  render(){
    console.log(this.props);

    return(
      <tbody >
        <tr style={{backgroundColor:'red'}}><td colSpan={12}>{this.props.barge.name}</td></tr>
        {
          this.renderTT()
        }
        <tr>
           <td colSpan={11}>Tong</td>
           <td>{this.total}</td>
        </tr>
      </tbody>
    )
  }
}
class BargeSalary extends React.Component {
  constructor(props){
    super(props)
    this.total =0;
  }
  renderBarge()
  {
    if(this.props.bargeLoading || !this.props.listBarge)
      return (<div  className="spinner spinner-lg"></div>)
      else {
        __.forEach(this.props.listBarge,(barge)=>{
          __.forEach(barge.barges,(item)=>{
            __.forEach(item.activities,(ac)=>{
              this.total= this.total + ac.total
            })
          })
        })
        return (<div style={{padding:'10px'}} >
          <table className="table table-bordered table-hover" id="table1">
          <thead>
            <tr><td colSpan={12}> DANH SÁCH TIỀN LƯƠNG THEO TỪNG CHỨC VỤ</td></tr>
            <tr>
              <th rowSpan={3}>Danh sách các chuyến hàng</th>
              <th rowSpan={3}>Tên hàng hóa</th>
              <th rowSpan={3}>Ngày bắt đầu</th>
              <th rowSpan={3}>Ngày giao xong</th>
              <th rowSpan={2} >Hệ số sà lan</th>
              <th colSpan={6} rowSpan={1}>Chi tiết vận chuyển</th>
              <th rowSpan={2}>Tổng</th>
            </tr>
            <tr>
              <th rowSpan={2}>Trạng thái</th>
              <th>Ngày bắt đầu</th>
              <th>Ngày kết thúc</th>
              <th>Tổng số ngày</th>
              <th>Lương trạng thái</th>
              <th>Hệ số chức vụ</th>
            </tr>
            <tr>
              <th>1</th>
              <th>2</th>
              <th>3</th>
              <th>4=3-2</th>
              <th>5</th>
              <th>6</th>
              <th>7=1x4x5x6</th>
            </tr>
          </thead>
            {
              this.props.listBarge.map((item,idx) => <Detail {...this.props} key={idx+item.name} barge={item}></Detail>)
            }
            <tbody>
              <tr>
                 <td colSpan={11}>TỔNG SỐ TIỀN THEO CHỨC VỤ</td>
                 <td>{this.total}</td>
              </tr>
            </tbody>
        </table>
        </div>)
      }
  }
  render(){
    return (
      <div>
        {this.renderBarge()}
      </div>
    )
  }
}
const GET_BARGE = gql`
  query getListSalary($dateStart: Float, $dateEnd: Float) {
      listBarge(dateStart:$dateStart,dateEnd:$dateEnd) {
        positionId
        name
        barges {
          _id
          dateStart
          dateEnd
          product
          coefficientBarge
          positionId
          activities {
            _id
            bargeId
            positionId
            dateStart
            dateEnd
            totalDate
            coefficientPosition
            statusId
            statusName
            statusSalary
            total
          }
        }
      }
}`
const mapdataSalary = graphql(
  GET_BARGE,
  {
    options: { variables: {dateStart: 10, dateEnd:25}, forceFetch: true},
    props: ({ ownProps, data: { loading, listBarge, refetch} }) => ({
     bargeLoading: loading,
     listBarge: listBarge,
     refetchBarge: refetch
    }),
  }
)
export default compose(
  mapdataSalary,
)(BargeSalary)
