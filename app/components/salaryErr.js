import __ from 'lodash'
import React,{PropTypes} from 'react'
import ReactDOM from 'react-dom'
import store from '../store'
import {compose ,graphql} from 'react-apollo'
import gql from 'graphql-tag';
import { Link, Router, browserHistory } from 'react-router'

//detail salary position
class DetailPositon extends React.Component {
  constructor(props) {
    super(props)
    this.totalposition =0;
  }
   renderTT(){
     this.totalposition =0;
     let listtr =[], firstAc = {};
     __.forEach(this.props.barge.barges,(i,idx)=>{
       if(i.activities && i.activities.length>=0)
       {
         firstAc = i.activities[0];
        this.totalposition = this.totalposition + firstAc.total;
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
        //  let arr = i.activities.splice(0,1)
        //  console.log("dd",arr);
         __.forEach(i.activities.slice(1),(ac)=>{
           if(ac)
           {
             this.totalposition = this.totalposition + ac.total;
             listtr.push((<tr key={i._id+this.totalposition}>
               <td>{ac.statusName}</td>
               <td>{ac.dateStart}</td>
               <td>{ac.dateEnd}</td>
               <td>{ac.totalDate}</td>
               <td>{ac.statusSalary}</td>
               <td>{ac.coefficientPosition}</td>
               <td>{ac.total}</td>
             </tr>))
           }
         })
       }
     })
     return listtr
   }
  render(){
    return(
      <tbody >
        <tr style={{backgroundColor:'rgb(120, 143, 189)'}}><td colSpan={12}>{this.props.barge.name}</td></tr>
        {
          this.renderTT()
        }
        <tr>
           <td colSpan={11}>Tổng tiền</td>
           <td>{this.totalposition}</td>
        </tr>
      </tbody>
    )
  }
}
//detail salary memberId
class DetailMember extends React.Component {
  constructor(props) {
    super(props)
    this.totalmember =0;
  }
  renderSalaryMember()
  {
    this.totalmember =0;
    let listtr =[], firstAc = {};
    __.forEach(this.props.member.listBarges,(i,idx)=>{
      if(i.salaryActive && i.salaryActive.length > 0)
      {
        firstAc = i.salaryActive[0];
        this.totalmember = this.totalmember + firstAc.totalSalary;
        listtr.push((
          <tr key={i._id + i.memberId}>
            <td rowSpan={i.salaryActive.length}>{i._id}</td>
            <td>{firstAc.statusName}</td>
            <td>{firstAc.dateStart}</td>
            <td>{firstAc.dateEnd}</td>
            <td>{firstAc.position}</td>
            <td>{firstAc.totalSalary}</td>
          </tr>
        ))
        // let arr = i.salaryActive.splice(0,1)
        __.forEach(i.salaryActive.slice(1),(activity)=>{
          if(activity)
          {
            this.totalmember = this.totalmember + activity.totalSalary;
            listtr.push((
              <tr key={i._id + i.memberId + activity.position + activity.totalSalary}>
                <td>{activity.statusName}</td>
                <td>{activity.dateStart}</td>
                <td>{activity.dateEnd}</td>
                <td>{activity.position}</td>
                <td>{activity.totalSalary}</td>
              </tr>
            ))
          }
        })
      }
    })
    return listtr
  }
  render(){
    return(
      <tbody>
        <tr style={{backgroundColor:'rgb(120, 143, 189)'}}><td colSpan={6}>{this.props.member.name}</td></tr>
        {this.renderSalaryMember()}
        <tr>
           <td colSpan={5}>Tổng tiền</td>
           <td>{this.totalmember}</td>
        </tr>
      </tbody>
    )
  }
}
class BargeSalary extends React.Component {
  constructor(props){
    super(props)
    this.totalSalaryPosition = 0;
    this.totalSalaryMember =0;
    this.state={start:10,end:20}
  }
  componentWillMount(){
  }
  renderBarge()
  {
    if(this.props.barges.loading || !this.props.barges)
      return (<div  className="spinner spinner-lg"></div>)
      else {
        this.start = this.props.barges.variables.dateStart
        this.end = this.props.barges.variables.dateEnd
        this.totalSalaryPosition = 0;
        __.forEach(this.props.barges.listBarge,(barge)=>{
          __.forEach(barge.barges,(item)=>{
            __.forEach(item.activities,(ac)=>{
              this.totalSalaryPosition= this.totalSalaryPosition + ac.total
            })
          })
        })
        return (<div style={{padding:'10px'}} >
          <div>
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
                  this.props.barges.listBarge.map((item,idx) => <DetailPositon {...this.props} key={idx+item.name} barge={item}></DetailPositon>)
                }
                <tbody>
                  <tr style={{backgroundColor:'rgb(179, 99, 109)'}}>
                     <td colSpan={11}>TỔNG SỐ TIỀN THEO CHỨC VỤ</td>
                     <td>{this.totalSalaryPosition}</td>
                  </tr>
                </tbody>
            </table>
          </div>
        </div>)
      }
  }
  renderMember(){
    if(this.props.barges.loading || !this.props.barges)
      return (<div  className="spinner spinner-lg"></div>)
      else {
        this.totalSalaryMember =0;
        __.forEach(this.props.barges.listMember,(item)=>{
          __.forEach(item.listBarges,(barge)=>{
            __.forEach(barge.salaryActive,(salary)=>{
              this.totalSalaryMember = this.totalSalaryMember + salary.totalSalary
            })
          })
        })
        return (<div style={{padding:'10px'}} >
          <table className="table table-bordered table-hover" id="table1">
          <thead>
            <tr><td colSpan={6}> DANH SÁCH TIỀN LƯƠNG THEO TỪNG NHÂN VIÊN</td></tr>
            <tr>
              <th >Danh sách các chuyến hàng</th>
              <th >Trạng thái</th>
              <th>Ngày bắt đầu</th>
              <th>Ngày kết thúc</th>
              <th >Chức vụ</th>
              <th >Tiền lương</th>
            </tr>
          </thead>
          {
            this.props.barges.listMember.map((item,idx) => <DetailMember {...this.props} key={idx + item.memberId+ item.name} member={item}></DetailMember>)
          }
          <tbody>
            <tr style={{backgroundColor:'rgb(179, 99, 109)'}}>
               <td colSpan={5}>TỔNG SỐ TIỀN THEO NHÂN VIÊN</td>
               <td>{this.totalSalaryMember}</td>
            </tr>
          </tbody>
        </table>
        </div>)
      }
  }
  refesh(event){
    this.props.barges.variables.dateStart=this.state.start;
    this.props.barges.variables.dateEnd =this.state.end;
    this.total=0;
    this.props.barges.refetch();
  }
  render(){
    return (
      <div>
        <div style={{padding:'10px'}}>
          <input  value={this.state.start} onChange={({target})=>this.setState({start:target.value})}></input>
          <input  value={this.state.end} onChange={({target})=>this.setState({end:target.value})}></input>
          <button onClick={this.refesh.bind(this)}>Refesh</button>
        </div>
        <div>
          {this.renderBarge()}
        </div>
        <div>
          {this.renderMember()}
        </div>
      </div>
    )
  }
}
const SALARY_BARGE = gql`
  query getListSalary($shipId:String,$dateStart: Float, $dateEnd: Float) {
      listBarge(shipId:$shipId,dateStart:$dateStart,dateEnd:$dateEnd) {
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
      },
      listMember(shipId:$shipId,dateStart:$dateStart,dateEnd:$dateEnd) {
      memberId
      name
      listBargeId
      listBarges {
        _id
        coefficientBarge
        memberId
        salaryActive {
          statusName
          dateStart
          dateEnd
          position
          totalSalary
        }
      }
    }
}`
const mapdataSalary = graphql(
  SALARY_BARGE,
  {
    options: (props) => {
      var start = 10
      var end = 20
      return {
        variables: {
          shipId:props.params.id,
          dateStart:start,
          dateEnd:end
        },
        forceFetch: true
      }
    },
    name: 'barges'
  }
)
export default compose(
  mapdataSalary,
)(BargeSalary)
