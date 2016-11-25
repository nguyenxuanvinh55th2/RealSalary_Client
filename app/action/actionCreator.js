import { createAction, handleAction, handleActions } from 'redux-actions';
import { asteroid } from '../asteroid.js'
import store from '../store'

// const login = createAction('LOGIN', () => {
//   return true;
// });
// export const increate = createAction('INCREATSALARY', () => {
//   localStorage.removeItem("userInfo");
//   return false;
// });
// //action xử lý việc đăng nhập của user thông qua facebook
// //---------------------------------------------------------------------------------//
// export const loginFB = (userInfo) => {
//   asteroid.call("loginFbGgUser", userInfo).then(result => {
//       localStorage.setItem("userInfo", JSON.stringify(result));
//       store.dispatch(login());
//     })
//     .catch(error => {
//         console.error(error);
//     });
// };
//
// //action xử lý việc đăng nhập của user thông qua google
// //---------------------------------------------------------------------------------//
// export const loginGG = (userInfo) => {
//   asteroid.call("loginFbGgUser", userInfo).then(result => {
//       localStorage.setItem("userInfo", JSON.stringify(result));
//       store.dispatch(login());
//     }).catch(error => {
//         console.error(error);
//       });
// }
//
// //action xử lý việc đăng xuất của user
// //---------------------------------------------------------------------------------//
// export const logout = createAction('LOGOUT', () => {
//   localStorage.removeItem("userInfo");
//   return false;
// });

export function increateSalaly(total){
  return {
    type: 'INCREATSALARY',
    name
  }
}
