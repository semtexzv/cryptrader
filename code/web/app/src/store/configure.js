import {createStore, applyMiddleware, compose} from 'redux';
import {routerMiddleware} from 'connected-react-router'

import rootReducer from '../reducers/rootReducer';
import thunk from 'redux-thunk';
import logger from 'redux-logger';

export default function configureStore(history) {
    return createStore(
        rootReducer(history),
        compose(
            applyMiddleware(
                thunk,
                logger,
                routerMiddleware(history)
            )
        )
    );
}