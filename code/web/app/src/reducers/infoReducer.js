import * as types from '../actions/actionTypes';

const initial = {
    errors: [],
};

export default function dataReducer(state = initial, action) {
    state = Object.assign({}, state);


    switch (action.type) {
        case types.AUTH_INVALID:
            state.errors = action.data;
            return state;
        case types.AUTH_OK:
            state.errors = [];
            return state;
    }
    return state;
}