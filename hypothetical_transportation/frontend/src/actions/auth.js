import axios from 'axios';
//import { returnErrors } from './messages';
import {
    USER_LOADED,
    USER_LOADING,
    AUTH_ERROR,
    LOGIN_SUCCESS,
    LOGIN_FAIL
} from './types';

//CHECK TOKEN & LOAD USER
export const loadUser = () => (dispatch, getState) => {
    //User Loading
    dispatch({type: USER_LOADING});

    //Get token from state
    const token = getState().auth.token;

    //Headers
    const config = {
        headers: {
            'Content-Type' : 'application/json'
        }
    }

    //If token, add to headers config
    if(token) {
        config.headers['Authorization'] = `Token ${token}`;
    }

    axios.get('/api/auth/user', config)
    .then(res => {
        dispatch({
            type: USER_LOADED,
            payload: res.data
        });
    }).catch(err => {
        //dispatch(returnErrors(err.response.data));
        console.log(err.response.data);
        dispatch({
            type: AUTH_ERROR
        })
    })
}

//LOGIN USER
export const login = (email, password, isAdminLogin) => (dispatch) => {

    // const adminUser = {
    //     name: "Admin",
    //     email: "admin@admin.com",
    //     password: "admin123",
    //     admin: true,
    //     address: "",
    //     students: [],
    //     id: 1,
    //     username: "FakeAdmin"
    // };

    // const parentUser = {
    //     name: "Virginia",
    //     email: "parent@parent.com",
    //     password: "parent123",
    //     admin:false,
    //     address: "4015 E27th Ave",
    //     students:[
    //       {
    //         name:"Al",
    //         id: "123",
    //         school: "A high school",
    //         route: "#1",
    //       },
    //       {
    //         name:"Hugo",
    //         id:"456",
    //         school: "B high school",
    //         route: "#2",
    //       },
    //       {
    //         name:"James",
    //         id:"567",
    //         school: "C high school",
    //         route: "none",
    //       },
    //     ],
    //   };

    // const fakeAdminPayload = {
    //     user: adminUser,
    //     token: "myfaketoken"
    // }
    // const fakeParentPayload = {
    //     user: parentUser,
    //     token: "myfaketoken"
    // }

    // if (
    //     email === adminUser.email &&
    //     password === adminUser.password
    // ) {
    //     console.log("Logged in");
    //     dispatch({
    //         type: LOGIN_SUCCESS,
    //         payload: fakeAdminPayload
    //     });
    // } else if (
    //     email === parentUser.email &&
    //     password === parentUser.password
    // ) {
    //     console.log("Logged in");
    //     dispatch({
    //         type: LOGIN_SUCCESS,
    //         payload: fakeParentPayload
    //     });
    // } else {
    //     //console.log("Details do not match");
    //     dispatch({
    //         type: LOGIN_FAIL
    //     })
    // }


       //Headers
       const config = {
           headers: {
               'Content-Type' : 'application/json'
           }
       }
    
       //Request body to turn into JSON
       const body = JSON.stringify({email, password})
       console.log(body);
    
       axios.post('/api/auth/login', body, config)
       .then(res => {
           console.log(res);
           dispatch({
               type: LOGIN_SUCCESS,
               payload: res.data
           });
       }).catch(err => {
           //dispatch(returnErrors(err.response.data));
           console.log(err.response.data);
           dispatch({
               type: LOGIN_FAIL
           })
       })
}
