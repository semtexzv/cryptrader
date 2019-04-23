import * as types from '../actions/actionTypes';
import orm, {Strategy} from '../data'

const emptyState = orm.getEmptyState();
const defaultState = () => {
    let sess = orm.session(emptyState);
    return sess.state
};

const initial = {
    db: defaultState(),
};

export default function dataReducer(state = initial, action) {

    let sess = orm.mutableSession(state.db);
    let _state = Object.assign({}, state);

    switch (action.type) {
        case types.LOAD_ALL_SUCCESS:
            sess[action.dataType.modelName].all().delete();
            action.data.forEach(elem => {
                elem['id'] = action.dataType.id(elem);
                sess[action.dataType.modelName].upsert(elem)
            });
            _state.db = sess.state;
            return _state;
        case types.LOAD_ONE_SUCCESS:
            action.data['id'] = action.dataType.id(action.data);
            sess[action.dataType.modelName].upsert(action.data);
            _state.db = sess.state;
            return _state;
        case types.POST_ONE_SUCCESS:
            action.data['id'] = action.dataType.id(action.data);
            sess[action.dataType.modelName].upsert(action.data);
            _state.db = sess.state;
            return _state;
        case types.DELETE_ONE_SUCCESS:
            let x = sess[action.dataType.modelName].withId(action.id);
            if (x) {
                x.delete()
            }
            _state.db = sess.state;
            return _state;
        default:
    }
    return _state;
}