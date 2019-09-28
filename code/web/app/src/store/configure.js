import {createStore, applyMiddleware, compose} from 'redux';

import rootReducer from '../reducers/rootReducer';
import thunk from 'redux-thunk';
import logger from 'redux-logger';

export default function configureStore() {
    return createStore(
        rootReducer(),
        compose(
            applyMiddleware(
                thunk,
                logger,
            )
        )
    );
}