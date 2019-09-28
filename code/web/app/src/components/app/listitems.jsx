import React from 'react';

import PropTypes from "prop-types";
import ListItem from '@material-ui/core/ListItem/index';
import ListItemIcon from '@material-ui/core/ListItemIcon/index';
import ListItemText from '@material-ui/core/ListItemText/index';
import ListSubheader from '@material-ui/core/ListSubheader/index';

import DashboardIcon from '@material-ui/icons/Dashboard';
import PeopleIcon from '@material-ui/icons/People';
import AssignmentIcon from '@material-ui/icons/Assignment';
import CodeIcon from '@material-ui/icons/Code'
import AccountBalanceIcon from '@material-ui/icons/AccountBalance'
import TrendIcon from '@material-ui/icons/Timeline'


import {navigate} from 'hookrouter';
import {connect, useDispatch} from "react-redux";
import {goTo} from "../../actions/authActions";


const MainListItems = (props) => {
  const dispatch = useDispatch();
  return (<div>
    <ListItem button onClick={(e) => dispatch(goTo('/app'))}>
      <ListItemIcon>
        <DashboardIcon/>
      </ListItemIcon>
      <ListItemText primary="Home"/>
    </ListItem>
    <ListItem button onClick={(e) => dispatch(goTo('/app/strategies'))}>
      <ListItemIcon>
        <CodeIcon/>
      </ListItemIcon>
      <ListItemText primary="Strategies"/>
    </ListItem>

    <ListItem button onClick={(e) => dispatch(goTo('/app/assignments'))}>
      <ListItemIcon>
        <AssignmentIcon/>
      </ListItemIcon>
      <ListItemText primary="Assignments"/>
    </ListItem>
    <ListItem button onClick={(e) => dispatch(goTo('/app/traders'))}>
      <ListItemIcon>
        <AccountBalanceIcon/>
      </ListItemIcon>
      <ListItemText primary="Traders"/>
    </ListItem>
    <ListItem button onClick={(e) => dispatch(goTo('/app/evaluations'))}>
      <ListItemIcon>
        <TrendIcon/>
      </ListItemIcon>
      <ListItemText primary="Backtesting"/>
    </ListItem>
  </div>)
};

export default MainListItems;