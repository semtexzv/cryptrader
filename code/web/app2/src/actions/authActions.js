import * as types from "./actionTypes";
import { replace } from 'connected-react-router';

export function redirectToLogin() {
    return function (dispatch) {
        dispatch(replace("/app/login"))
    }
}