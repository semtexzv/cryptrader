import {combineReducers} from "redux";

import data from './dataReducer';
import info from './infoReducer';
import {connectRouter} from 'connected-react-router';

const rootReduder = (history) => (combineReducers({
    data,
    info,
    router: connectRouter(history)
}));


export default rootReduder;