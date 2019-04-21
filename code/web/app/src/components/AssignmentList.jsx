import React, {Component} from "react";
import {connect} from "react-redux";
import {deleteOne, loadAll, postOne} from "../actions/apiActions";
import PropTypes from "prop-types";
import {
    Dialog, DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle, FormControl,
    Paper, Select,
    TableBody,
    TableCell,
    TableRow, TextField
} from "@material-ui/core";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import Button from "@material-ui/core/Button";
import {Link} from "react-router-dom";
import {withStyles} from "@material-ui/styles";
import {TYPE_ASSIGNMENT, TYPE_PAIR, TYPE_STRATEGY, TYPE_TRADER} from "../api/baseApi";
import InputLabel from "@material-ui/core/InputLabel";
import orm from '../data'
import EditDialog from "./EditDialog";

const styles = (theme) => ({
    newButton: {
        width: '100%'
    }
});


class AssignmentList extends Component {

    state = {
        open: false,
        newData: {
            exchange: null,
            pair: null,
            period: null,
            strategy_id: null,
            trader_id: null
        }
    };

    static propTypes = {
        assignments: PropTypes.array

    };

    static defaultProps = {
        assignments: [],
        strategies: [],
        traders: []
    };


    handleClickOpen = () => {
        this.setState({open: true});
    };

    handleClose = () => {
        this.setState({open: false});
    };

    handleOk = () => {
        let {dispatch} = this.props;
        dispatch(postOne(TYPE_ASSIGNMENT, this.state.newData)).then(() => {
            this.handleClose();
        })
    };
    handleDelete = (it) => {
        let {dispatch} = this.props;
        dispatch(deleteOne(TYPE_ASSIGNMENT, it)).then(() => {
            this.handleClose();
        })
    };

    handleChangeNum = name => event => {
        let newData = {
            ...this.state.newData,
            [name]: Number(event.target.value),
        };
        this.setState({newData});
    };

    handleChangeText = name => event => {
        let newData = {
            ...this.state.newData,
            [name]: event.target.value
        };
        this.setState({newData});

    };
    handleChangePair = event => {
        let sel = event.target.options[event.target.selectedIndex];

        let newData = {
            ...this.state.newData,
            exchange: sel.dataset.exchange,
            pair: sel.dataset.pair
        };
        this.setState({newData});
    };

    componentDidMount() {
        let {dispatch} = this.props;
        dispatch(loadAll(TYPE_ASSIGNMENT));
        dispatch(loadAll(TYPE_STRATEGY));
        dispatch(loadAll(TYPE_TRADER));
        dispatch(loadAll(TYPE_PAIR));
    }

    render() {
        let {classes, assignments, strategies, pairs, periods, traders, dispatch} = this.props;
        console.log()
        return (<div>
            <Paper>
                <Table>

                    <TableHead>
                        <TableRow>
                            <TableCell>Exchange</TableCell>
                            <TableCell>Pair</TableCell>
                            <TableCell>Period</TableCell>
                            <TableCell>Strategy</TableCell>
                            <TableCell>Trader</TableCell>
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
                        {assignments.map(
                            row => (
                                <TableRow>
                                    <TableCell>{row.exchange}</TableCell>
                                    <TableCell>{row.pair}</TableCell>
                                    <TableCell>{row.period}</TableCell>
                                    <TableCell>{row.strategy_id}</TableCell>
                                    <TableCell>{row.trader_id}</TableCell>
                                    <TableCell align="right">
                                        <Button color="primary">Remove</Button>
                                    </TableCell>
                                </TableRow>
                            )
                        )}</TableBody>
                </Table>
            </Paper>
            <EditDialog
                open={this.state.open}
                title="Assignment"
                text="Create new assignment"
                data={this.state.newData}
                onData={d => {

                    this.setState({newData: d})
                }}
                onDismiss={save => {
                    if (save) {
                        dispatch(postOne(TYPE_ASSIGNMENT, this.state.newData)).then(() => {
                            this.setState({open: false})
                        })
                    }
                }}
                attrs={[
                    {
                        name: "asset",
                        title: "Asset",
                        type: "select",
                        values: pairs,
                        text: (e) => e.exchange + "/" + e.pair,
                        isSelected: (data, e) => {
                            return data.exchange == e.exchange && data.pair == e.pair
                        },
                        select: (e) => {
                            this.setState({newData: {...this.state.newData, pair: e.pair, exchange: e.exchange}})
                        }
                    },
                    {
                        name: "period",
                        title: "Period",
                        type: "select",
                        values: periods,
                        text: (i) => i.text,
                        isSelected: (data, e) => {
                            return data.period == e.text
                        },
                        select: (e) => {
                            this.setState({newData: {...this.state.newData, period: e.text}})
                        }
                    },
                    {
                        name: "strategy_id",
                        title: "Strategy",
                        type: "select",
                        values: strategies,
                        text: (e) => e.name,
                        isSelected: (data, e) => {
                            return data.strategy_id == e.id
                        },
                        select: (e) => {
                            this.setState({newData: {...this.state.newData, strategy_id: e.id}})
                        }
                    },
                    {
                        name: "trader_id",
                        title: "Trader",
                        type: "select",
                        values: traders,
                        text: (e) => e.name,
                        isSelected: (data, e) => {
                            return data.trader_id == e.id
                        },
                        select: (e) => {
                            this.setState({newData: {...this.state.newData, trader_id: e.id}})
                        }
                    }
                ]}
            />

        </div>)
    }
}

function mapStoreToProps(state, props) {

    let sess = orm.session(state.data.db);

    return {
        assignments: sess.Assignment.all().toRefArray(),
        strategies: sess.Strategy.all().toRefArray(),
        pairs: sess.Pair.all().toRefArray(),
        periods: sess.Period.all().toRefArray(),
        traders: sess.Trader.all().toRefArray(),
    };
}

export default connect(mapStoreToProps)(withStyles(styles)(AssignmentList));