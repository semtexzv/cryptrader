import * as types from "./actionTypes";
import {replace} from 'connected-react-router';
import api from "../api/baseApi";
import {AUTH_INVALID} from "./actionTypes";
import {AUTH_OK} from "./actionTypes";

export function redirectToLogin() {
    return function (dispatch) {
        dispatch(replace("/app/auth"))
    }
}


export function signin(data) {
    console.log("Logging in");
    return function (dispatch) {
        return api.signin(data).then(d => {
            dispatch({type: AUTH_OK});
            dispatch(replace("/app/"))
        }).catch(e => {
            e.json().then(e => {
                dispatch({type: AUTH_INVALID, data: e})
            })
        })

    }
}

export function signup(data) {
    return function (dispatch) {
        return api.signup(data).then(d => {
            dispatch({type: AUTH_OK});
            dispatch(replace("/app/"))
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

