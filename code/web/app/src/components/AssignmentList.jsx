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
        let {classes, assignments, strategies, pairs, periods, traders} = this.props;
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
            <Dialog open={this.state.open}>
                <DialogTitle id="form-dialog-title">Create Assignment</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please create a new assignment
                    </DialogContentText>
                    <FormControl>
                        <InputLabel htmlFor="assignment-pair">Pair</InputLabel>
                        <Select
                            native
                            onChange={this.handleChangePair}
                            inputProps={{
                                name: 'pair',
                                id: 'assignment-pair'
                            }}
                        >
                            <option value=""/>
                            {pairs.map(p => (
                                <option data-exchange={p.exchange} data-pair={p.pair}>{p.exchange}/{p.pair}</option>))}

                        </Select>
                    </FormControl>
                    <FormControl>
                        <InputLabel htmlFor="assignment-period">Period</InputLabel>
                        <Select
                            native
                            onChange={this.handleChangeText('period')}
                            inputProps={{
                                name: 'period',
                                id: 'assignment-period'
                            }}
                        >
                            <option value=""/>
                            {periods.map(p => (<option value={p}>{p}</option>))}

                        </Select>
                    </FormControl>
                    <FormControl>
                        <InputLabel htmlFor="assignment-strategy">Strategy</InputLabel>
                        <Select
                            native
                            onChange={this.handleChangeNum('strategy_id')}
                            inputProps={{
                                name: 'strategy',
                                id: 'assignment-strategy'
                            }}
                        >
                            <option value=""/>
                            {strategies.map(p => (<option value={p.id}>{p.name}</option>))}

                        </Select>
                    </FormControl>
                    <FormControl>
                        <InputLabel htmlFor="assignment-trader">Trader</InputLabel>
                        <Select
                            native
                            onChange={this.handleChangeNum('trader_id')}
                            inputProps={{
                                name: 'trader',
                                id: 'assignment-trader'
                            }}
                        >

                            <option value=""/>
                            {traders
                                .filter(t => assignments.find(a => a.trader_id == t.id) == null)
                                .map(p => (<option value={p.id}>{p.name}</option>))
                            }

                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button color="primary" onClick={this.handleClose}>Cancel</Button>
                    <Button color="primary" onClick={this.handleOk}>Ok</Button>
                </DialogActions>
            </Dialog>
        </div>)
    }
}

function mapStoreToProps(state, props) {
    return {
        assignments: state.data.assignments,
        strategies: state.data.strategies,
        pairs: state.data.pairs,
        periods: state.data.periods,
        traders: state.data.traders,
    };
}

export default connect(mapStoreToProps)(withStyles(styles)(AssignmentList));