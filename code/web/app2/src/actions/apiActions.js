import api from '../api/baseApi'
import * as types from "./actionTypes";
import {redirectToLogin} from "./authActions";

export function loadAll(type) {
    return function (dispatch) {
        return api.getAll(type).then(data => {
            dispatch(loadAllSuccess(type, data))
        }).catch(err => {
            if (err.status == 401) {
                dispatch(redirectToLogin());
            }
        })
    }
}

export function postOne(type, v) {
    return function (dispatch) {
        return api.postOne(type, v).then(data => {
            dispatch(postOneSuccess(type, data))
        }).catch(err => {
            if (err.status == 401) {
                dispatch(redirectToLogin());
            }
        })
    }
}

export function deleteOne(type, v) {
    return function (dispatch) {
        return api.deleteOne(type, v).then(data => {
            dispatch(deleteOneSuccess(type, v.id))
        }).catch(err => {
            if (err.status == 401) {
                dispatch(redirectToLogin());
            }
        })
    }
}

export function loadAllSuccess(type, data) {
    return {
        type: types.LOAD_ALL_SUCCESS,
        dataType: type,
        data
    };
}

export function postOneSuccess(type, v) {
    return {
        type: types.POST_ONE_SUCCESS,
        dataType: type,
        data: v
    }
}

export function deleteOneSuccess(type, id) {
    return {
        type: types.DELETE_ONE_SUCCESS,
        dataType: type,
        id: id,
    }
}