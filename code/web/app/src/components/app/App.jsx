import React, {Component} from 'react';
import './App.css';

import {ConnectedRouter} from 'connected-react-router'
import {Route, Switch} from 'react-router';

import Dashboard from "./Dashboard";
import {Provider} from "react-redux";
import {loadAll} from "../../actions/apiActions";

import configureStore from "../../store/configure";

import StrategyList from "./../strategy/StrategyList";
import StrategyDetail from "./../strategy/StrategyDetail";
import AssignmentList from "./../AssignmentList";
import TraderList from "./../TraderList";
import Login from "../Auth";

import {createBrowserHistory} from "history";
import {TYPE_PAIR, TYPE_PERIOD} from "../../api/baseApi";
import Home from "./Home";
import ThemeProvider from "@material-ui/styles/es/ThemeProvider";

export const history = createBrowserHistory();
const store = configureStore(history);

store.dispatch(loadAll(TYPE_PAIR));
store.dispatch(loadAll(TYPE_PERIOD));

const theme = {
    danger: '#F00'
}

export default class App extends Component {
    render() {
        return (
            <ThemeProvider theme={theme} >
            <Provider store={store}>
                <div className="App">
                    <ConnectedRouter history={history}>
                        <Switch>
                            <Route exact path="/app/auth" component={Login}/>
                            <Route path="/app" render={props => (
                                <Dashboard>
                                    <Switch>
                                        <Route exact path="/app/"  component={Home} />
                                        <Route exact path="/app/strategies" component={StrategyList}/>
                                        <Route exact path="/app/strategies/:id" component={StrategyDetail}/>
                                        <Route exact path="/app/assignments" component={AssignmentList}/>
                                        <Route exact path="/app/traders" component={TraderList}/>
                                    </Switch>
                                </Dashboard>
                            )}/>
                        </Switch>
                    </ConnectedRouter>
                </div>
            </Provider>
            </ThemeProvider>
        );
    }
}