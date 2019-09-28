import React, {Component} from "react";
import PropTypes from "prop-types";

import {connect} from "react-redux";
import {
    Dialog,
    DialogActions,
    DialogTitle,
    DialogContent,
    DialogContentText,
    FormControl,
    Paper,
    TableBody,
    TableCell,
    TableRow,
    TextField
} from "@material-ui/core";
import Table from "@material-ui/core/Table/index";
import TableHead from "@material-ui/core/TableHead/index";
import Button from "@material-ui/core/Button/index";
import {Link} from "react-router-dom"
import {withStyles} from "@material-ui/styles";
import {loadAll, postOne} from "../../actions/apiActions";
import {TYPE_STRATEGY} from "../../api/baseApi";
import orm, {allStrategiesSelector} from "../../data";
import EditDialog from "../EditDialog";


const styles = (theme) => ({
    newButton: {
        width: '100%'
    },
    tableWrapper: {
        overflowX: "auto"
    }
});

class StrategyList extends Component {
    state = {
        open: false,
        newStrat: {
            name: "",
            body: ""
        }
    };

    static propTypes = {
        strategies: PropTypes.array
    };

    static defaultProps = {
        strategies: []
    };


    handleClickOpen = () => {
        this.setState({open: true});
    };

    handleClose = () => {
        this.setState({open: false});
    };

    handleOk = () => {
        let {dispatch} = this.props;
        dispatch(postOne(TYPE_STRATEGY, this.state.newStrat)).then(() => {
            this.handleClose();
        })
    };


    componentDidMount() {
        this.props.dispatch(loadAll(TYPE_STRATEGY));
    }

    render() {
        let {classes} = this.props;
        return (<div>
            <Paper className={classes.tableWrapper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell colSpan="10">
                                <Button variant="text" color="primary" className={classes.newButton}
                                        onClick={this.handleClickOpen}>Add new</Button>
                            </TableCell>
                        </TableRow>
                        {this.props.strategies.map(
                            row => (
                                <TableRow key={row.id}>
                                    <TableCell>
                                        {row.name}
                                    </TableCell>
                                    <TableCell align="right">
                                        <Button component={Link} to={`/app/strategies/${row.id}`}
                                                color="primary">Edit</Button>
                                    </TableCell>
                                </TableRow>
                            )
                        )}
                    </TableBody>
                </Table>
            </Paper>
            <EditDialog open={this.state.open}
                        valid={this.state.newStrat.name}
                        title="New strategy"
                        text="Create new strategy"
                        data={this.state.newStrat}
                        onData={d => {
                            this.setState({newStrat: d});
                        }}
                        onDismiss={save => {
                            if (save) {
                                this.handleOk()
                            } else {
                                this.handleClose()
                            }
                        }}
                        attrs={[{name: "name", title: "Name", type: "text"}]}
            />
        </div>)
    }
}


function mapStoreToProps(state, props) {
    let sess = orm.session(state.data.db);
    return {
        strategies: sess.Strategy.all().toRefArray()
    };

}

export default connect(mapStoreToProps)(withStyles(styles)(StrategyList));