import {combineReducers} from "redux";

import data from './dataReducer';
import {connectRouter} from 'connected-react-router';

const rootReduder = (history) => (combineReducers({
    data,
    router: connectRouter(history)
}));



export default rootReduder;