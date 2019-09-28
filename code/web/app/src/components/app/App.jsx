import React, {Component} from 'react';

import {useRoutes} from 'hookrouter';

import Dashboard from "./Dashboard";
import {Provider} from "react-redux";
import {loadAll} from "../../actions/apiActions";

import configureStore from "../../store/configure";

import StrategyList from "./../strategy/StrategyList";
import StrategyDetail from "./../strategy/StrategyDetail";
import AssignmentList from "../assignment/AssignmentList";
import TraderList from "../traders/TraderList";
import Login from "../util/Auth";

import {TYPE_PAIR, TYPE_PERIOD} from "../../api/baseApi";
import Home from "./Home";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

const store = configureStore();

store.dispatch(loadAll(TYPE_PAIR));
store.dispatch(loadAll(TYPE_PERIOD));

const Evaluations = () => {
  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'stretch',
      justifyContent: 'center'
    }}><Typography style={{display: 'flex', margin: '80px'}} component="p" color='textSecondary' variant='h4'>
      Coming soon
    </Typography>
    </div>
  )
};


function AppRoot(props) {
  const authRoutes = {
    "/app/auth": () => (<Login/>)
  };

  const normalRoutes = {
    "/app/?": () => (<Home/>),
    "/app/strategies": () => (<StrategyList/>),
    "/app/strategies/:id": ({id}) => (<StrategyDetail id={id}/>),
    "/app/assignments": () => (<AssignmentList/>),
    "/app/traders": () => (<TraderList/>),
    "/app/evaluations": () => (<Evaluations/>)
  };

  const authRouteResult = useRoutes(authRoutes);
  const normalRouteResult = useRoutes(normalRoutes);

  return (
    <div className="App">
      {authRouteResult || (
        <Dashboard>
          {normalRouteResult}
        </Dashboard>
      )}
    </div>
  )
}
export const App = () => {

  const theme = createMuiTheme({
    danger: '#F00'
  });


  return (
    <MuiThemeProvider theme={theme}>
      <Provider store={store}>
        <AppRoot />
      </Provider>
    </MuiThemeProvider>
  );
};

export default App;