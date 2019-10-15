import {navigate} from 'hookrouter'
import * as types from "./actionTypes";
import api from "../api/baseApi";
import {AUTH_INVALID} from "./actionTypes";
import {AUTH_OK} from "./actionTypes";


export function goTo(loc) {
  return function (dispatch) {
    dispatch(() => navigate(loc));
  }
}

export function redirectToLogin() {
  return function (dispatch) {
    dispatch(() => navigate("/app/auth"))
  }
}

export function redirectToHome() {
  return function (dispatch) {
    dispatch(() => navigate("/app"))
  }
}

export function signin(data) {
  return function (dispatch) {
    return api.signin(data).then(d => {
      dispatch({type: AUTH_OK});
      dispatch(redirectToHome())
    }).catch(e => {
      e.json().then(e => {
        dispatch({type: AUTH_INVALID, data: e})
      })
    })

  }
}

export function signup(data) {
  console.log("Signing up");
  return function (dispatch) {
    return api.signup(data).then(d => {
      dispatch({type: AUTH_OK});
      dispatch(redirectToHome())
    }).catch(e => {
      e.json().then(e => {
        dispatch({type: AUTH_INVALID, data: e})
      })
    })
  }
}


export function logout() {
  return function (dispatch) {
    return api.logout().then(d => {
      dispatch(redirectToLogin())
    }).catch(e => {
      e.json().then(e => {
        dispatch({type: AUTH_INVALID, data: e})
      })
    })
  }
}

