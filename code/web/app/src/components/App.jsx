import React, {Component} from 'react';
import './App.css';

import { ConnectedRouter } from 'connected-react-router'
import { Route, Switch} from 'react-router';

import Dashboard from "./Dashboard";
import {Provider} from "react-redux";
import {loadAll} from "../actions/apiActions";

import configureStore from "../store/configure";

import StrategyList from "./StrategyList";
import StrategyDetail from "./StrategyDetail";
import AssignmentList from "./AssignmentList";
import TraderList from "./TraderList";
import Login from "./Auth";

import {createBrowserHistory} from "history";
import {TYPE_STRATEGY} from "../api/baseApi";

export const history = createBrowserHistory();
const store = configureStore(history);

store.dispatch(loadAll(TYPE_STRATEGY));

class Home extends Component {
    render() {
        return (<div>
        </div>)
    }
}

const notInLogin = /^(?!.*(\/app\/login)).*$/;


export default class App extends Component {
    render() {
        return (
            <Provider store={store}>
                <div className="App">
                    <ConnectedRouter history={history}>
                        <Switch>
                            <Route exact path="/app/auth" component={Login}/>
                            <Route path="/app" render={props => (
                                <Dashboard>
                                    <Route exact path="/app/dashboard" component={Home}/>
                                    <Route exact path="/app/strategies" component={StrategyList}/>
                                    <Route exact path="/app/strategies/:id" component={StrategyDetail}/>
                                    <Route exact path="/app/assignments" component={AssignmentList}/>
                                    <Route exact path="/app/traders" component={TraderList}/>
                                </Dashboard>
                            )}/>
                        </Switch>
                    </ConnectedRouter>
                </div>
            </Provider>
        );
    }
}