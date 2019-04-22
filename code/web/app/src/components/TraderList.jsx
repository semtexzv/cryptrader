import React, {Component} from "react";
import {connect} from "react-redux";
import PropTypes from "prop-types";
import {deleteOne, loadAll, postOne} from "../actions/apiActions";
import {
    Dialog, DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle, FormControl,
    Paper,
    TableBody,
    TableCell,
    TableRow, TextField
} from "@material-ui/core";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import Button from "@material-ui/core/Button";
import {Link} from "react-router-dom";
import {TYPE_STRATEGY, TYPE_TRADER} from "../api/baseApi";
import {withStyles} from "@material-ui/styles";
import EditDialog from "./EditDialog";
import orm from "../data";

const styles = (theme) => ({
    newButton: {
        width: '100%'
    }
});

class TraderList extends Component {
    state = {
        open: false,
        newTrader: {}
    };

    static propTypes = {
        traders: PropTypes.array
    };

    static defaultProps = {
        traders: []
    };

    componentDidMount() {
        let {dispatch} = this.props;
        dispatch(loadAll(TYPE_TRADER))
    }

    handleClickOpen = () => {
        this.setState({open: true});
    };

    handleClose = () => {
        this.setState({open: false});
    };


    render() {
        let {classes, dispatch} = this.props;
        let values = ["bitfinex"];

        let valid = Boolean(this.state.newTrader.name
            && this.state.newTrader.exchange
            && this.state.newTrader.api_key
            && this.state.newTrader.api_secret);

        return (
            <div>
                <Paper>
                    <Table>

                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>Exchange</TableCell>
                                <TableCell>Key</TableCell>
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
                            {this.props.traders.map(
                                row => (
                                    <TableRow key={row.id}>
                                        <TableCell>{row.name}</TableCell>
                                        <TableCell>{row.exchange}</TableCell>
                                        <TableCell>{row.api_key}</TableCell>
                                        <TableCell align="right">
                                            <Button color="primary"
                                                    onClick={e => dispatch(deleteOne(TYPE_TRADER, row.id))}
                                            >Delete</Button>
                                            <Button color="primary"
                                                    onClick={e => {
                                                        this.setState({newTrader: row, open: true})
                                                    }}
                                            >Edit</Button>
                                        </TableCell>
                                    </TableRow>
                                )
                            )}</TableBody>
                    </Table>
                </Paper>
                <EditDialog
                    open={this.state.open}
                    valid={valid}
                    data={this.state.newTrader}

                    title="New trader"
                    text="Create a new trading account"
                    onData={(d) => {
                        this.setState({newTrader: d})
                    }}
                    attrs={[
                        {name: "name", title: "Name", type: "text"},
                        {name: "api_key", title: "Api key", type: "text"},
                        {name: "api_secret", title: "Api secret", type: "text"},
                        {
                            name: "exchange", title: "Exchange", type: "select",
                            values: values,
                            text: (e) => e,
                        }
                    ]}
                    onDismiss={(save) => {
                        this.setState({open: false});
                        if (save) {
                            dispatch(postOne(TYPE_TRADER, this.state.newTrader)).then(() => {
                                this.handleClose();
                            })
                        }
                    }}

                />


            </div>)
    }
}


function mapStoreToProps(state, props) {
    let sess = orm.session(state.data.db);
    console.log("Mapping traderlist");
    return {
        traders: sess.Trader.all().toRefArray()
    };
}

export default connect(mapStoreToProps)(withStyles(styles)(TraderList));