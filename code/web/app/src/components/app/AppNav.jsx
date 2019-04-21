import React, {Component} from "react";
import {List, ListItem, ListItemText} from "@material-ui/core";
import Drawer from "@material-ui/core/Drawer/index";
import { ThemeProvider, makeStyles } from '@material-ui/styles';

const drawerWidth = 240;


const styles = theme => ({
    root: {
        display: 'flex',
    },
    appBar: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    toolbar: theme.mixins.toolbar,
    content: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.default,
        padding: theme.spacing.unit * 3,
    },
});


export class AppNav extends Component {

    render() {
        let classes = makeStyles(styles);

        return (
            <Drawer
                variant="permanent"
                anchor="left"
                className={classes.drawer}
                classes={{
                    paper: classes.drawerPaper
                }}
            >
                <List>
                    <ListItem>
                        <ListItemText primary="bla"/>
                    </ListItem>
                </List>
            </Drawer>
        )
    }
}