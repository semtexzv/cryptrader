import {combineReducers} from "redux";

import data from './dataReducer';
import info from './infoReducer';

const rootReduder = () => (combineReducers({
    data,
    info,
}));


export default rootReduder;