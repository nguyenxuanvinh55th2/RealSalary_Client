function salary( state = [], action){
  switch (action.type) {
  case 'INCREATSALARY':
    return Object.assign({}, state,{
      salary:100
    })
  default:
    return state;
  }
}
export default salary;
