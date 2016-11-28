import __ from 'lodash'
import React,{PropTypes} from 'react'
import ReactDOM from 'react-dom'
import store from '../store'
import {compose ,graphql} from 'react-apollo'
import gql from 'graphql-tag';
import { Link, Router, browserHistory } from 'react-router'

//detail salary memberId
class DetailSalaryMember extends React.Component {
  constructor(props) {
    super(props)
    this.totalmember =0;
  }
  renderSalaryMember()
  {
    this.totalmember =0;
    let listtr =[], firstAc = {},firstSalary ={};
    __.forEach(this.props.member.documents,(i,idx)=>{
      if(i.salaryActive && i.salaryActive.length > 0 )
      {
        firstAc = i.salaryActive[0];
        if(firstAc.salary  && firstAc.salary.length > 0)
        {
          firstSalary = firstAc.salary[0];
          this.totalmember = this.totalmember + firstSalary.totalSalary
          listtr.push((
            <tr key={i._id+firstAc.statusName}>
              <td rowSpan={i.salaryActive.length}>{i._id}</td>
              <td rowSpan={firstAc.salary.length}>{firstAc.statusName}</td>
              <td>{firstSalary.positionName}</td>
              <td>{firstSalary.totalSalary}</td>
            </tr>
          ))
          __.forEach(firstAc.salary.slice(1),(salary)=>{
            if(ac)
            {
              this.totalmember = this.totalmember + salary.totalSalary
              listtr.push((
                <tr key={i._id+firstAc.statusName+salary}>
                  <td>{salary.positionName}</td>
                  <td>{salary.totalSalary}</td>
              </tr>))
            }
          })
        }
        __.forEach(i.salaryActive.slice(1),(ac)=>{
          if(ac)
          {
            console.log(ac);

            let first = ac.salary[0];
            this.totalmember = this.totalmember + first.totalSalary
            listtr.push((
              <tr key ={i._id+ac.statusName+first.positionName} >
                <td rowSpan={ac.salary.length}>{ac.statusName}</td>
                <td>{first.positionName}</td>
                <td>{first.totalSalary}</td>
              </tr>
            ))
            __.forEach(ac.salary.slice(1),(salary)=>{
              if(salary)
              {
                this.totalmember = this.totalmember + salary.totalSalary
                listtr.push((
                  <tr key={i._id+ac.statusName+salary.positionName}>
                    <td>{salary.positionName}</td>
                    <td>{salary.totalSalary}</td>
                </tr>))
              }
            })
          }
    })
  }
  })
    return listtr
  }
  render(){
    console.log(this.props.member);

    return(
      <tbody>
        <tr style={{backgroundColor:'rgb(120, 143, 189)'}}><td colSpan={4}>{this.props.member.name}</td></tr>
        {this.renderSalaryMember()}
        <tr>
           <td colSpan={3}>Tổng tiền</td>
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
    if(this.props.dataSalary.loading || !this.props.dataSalary)
      return (<div  className="spinner spinner-lg"></div>)
      else {
        // console.log(this.props.dataSalary.bargerSalary.salarymembers);

        this.totalSalaryMember =0;
        __.forEach(this.props.dataSalary.bargerSalary.salarymembers,(item)=>{
          __.forEach(item.documents,(doc)=>{
            __.forEach(doc.salaryActive,(ac)=>{
              __.forEach(ac.salary,(salary)=>{
                this.totalSalaryMember = this.totalSalaryMember + salary.totalSalary
              })
            })
          })
        })
        return (<div style={{padding:'10px'}} >
          <table className="table table-bordered table-hover" id="table1">
          <thead>
            <tr><td colSpan={4}> DANH SÁCH TIỀN LƯƠNG THEO TỪNG NHÂN VIÊN</td></tr>
            <tr>
              <th >Danh sách các chuyến hàng</th>
              <th >Hoạt động</th>
              <th >Chức vụ</th>
              <th >Tiền lương</th>
            </tr>
          </thead>
          {
            this.props.dataSalary.bargerSalary.salarymembers.map((item,idx) => <DetailSalaryMember {...this.props} key={idx + item._id+ item.name} member={item}></DetailSalaryMember>)
          }
          <tbody>
            <tr style={{backgroundColor:'rgb(179, 99, 109)'}}>
               <td colSpan={3}>TỔNG SỐ TIỀN THEO NHÂN VIÊN</td>
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
        {/* <div style={{padding:'10px'}}>
          <input  value={this.state.start} onChange={({target})=>this.setState({start:target.value})}></input>
          <input  value={this.state.end} onChange={({target})=>this.setState({end:target.value})}></input>
          <button onClick={this.refesh.bind(this)}>Refesh</button>
        </div> */}
        {/* <div>
          {this.renderBarge()}
        </div> */}
        <div>
          {this.renderMember()}
        </div>
      </div>
    )
  }
}
const SALARY_BARGE = gql`
  query getListSalary($bargeId:String,$timeStart: Float, $timeEnd: Float) {
      bargerSalary(bargeId:$bargeId,timeStart:$timeStart,timeEnd:$timeEnd) {
        salarymembers {
           _id
           name
           documents {
             _id
             salaryActive {
               statusName
               salary {
                 positionName
                 totalSalary
               }
             }
           }
     }
    }
}`
const mapdataSalary = graphql(
  SALARY_BARGE,
  {
    options: (props) => {
      var start = 1
      var end = 30
      return {
        variables: {
          bargeId:"xalan1",
          timeStart:start,
          timeEnd:end
        },
        forceFetch: true
      }
    },
    name: 'dataSalary'
  }
)
export default compose(
  mapdataSalary,
)(BargeSalary)
