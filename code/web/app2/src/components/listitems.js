import React from 'react';

import PropTypes from "prop-types";
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';

import DashboardIcon from '@material-ui/icons/Dashboard';
import PeopleIcon from '@material-ui/icons/People';
import AssignmentIcon from '@material-ui/icons/Assignment';
import CodeIcon from '@material-ui/icons/Code'
import AccountBalanceIcon from '@material-ui/icons/AccountBalance'
import TrendIcon from '@material-ui/icons/Timeline'


import { push } from 'connected-react-router';
import {connect} from "react-redux";

class MainListItems extends React.Component {

    render() {
        const {dispatch} = this.props;

        return (<div>
            <ListItem button onClick={(e) => dispatch(push('/app'))}>
                <ListItemIcon>
                    <DashboardIcon/>
                </ListItemIcon>
                <ListItemText primary="Home"/>
            </ListItem>
            <ListItem button onClick={(e) => dispatch(push('/app/strategies'))}>
                <ListItemIcon>
                    <CodeIcon/>
                </ListItemIcon>
                <ListItemText primary="Strategies"/>
            </ListItem>

            <ListItem button onClick={(e) =>  dispatch(push('/app/assignments'))}>
                <ListItemIcon>
                    <AssignmentIcon/>
                </ListItemIcon>
                <ListItemText primary="Assignments"/>
            </ListItem>
            <ListItem button onClick={(e) =>  dispatch(push('/app/traders'))}>
                <ListItemIcon>
                    <AccountBalanceIcon/>
                </ListItemIcon>
                <ListItemText primary="Traders"/>
            </ListItem>
            <ListItem button onClick={(e) =>  dispatch(push('/app/evaluations'))}>
                <ListItemIcon>
                    <TrendIcon/>
                </ListItemIcon>
                <ListItemText primary="Evaluations"/>
            </ListItem>
        </div>)
    }
}


export default connect()(MainListItems);