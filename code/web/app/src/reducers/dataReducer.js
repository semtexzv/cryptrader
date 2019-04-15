import * as types from '../actions/actionTypes';

import {schema, normalize} from 'normalizr';

const strategy = new schema.Entity('strategies', {});

const trader = new schema.Entity('traders', {});

const assignment = new schema.Entity('assignment', {
    strategy_id: strategy,
    trader_id: trader,
});

const schemas = {
    assignments: assignment,
    strategies: strategy,
    traders: trader
};

const initial = {
    strategies: [],
    assignments: [],
    traders: [],
    pairs: [],
    periods: ["1m", "5m", "15m"],
    evaluations: [],
};

export default function dataReducer(state = initial, action) {
    let _state = Object.assign({}, state);
    switch (action.type) {
        case types.LOAD_ALL_SUCCESS:
            var normalized = normalize(action.data, new schema.Array(schemas[action.dataType.field]));
            _state[action.dataType.field] = action.data;
            return _state;
        case types.POST_ONE_SUCCESS:
            var normalized = normalize(action.data, schemas[action.dataType.field]);
            _state[action.dataType.field] = [...state[action.dataType.field], action.data];
            return _state;
        case types.DELETE_ONE_SUCCESS:
            _state[action.dataType.field] = _state[action.dataType.field].filter(i => i.id != action.id);
            return _state;
        default:
            return state;
    }
}