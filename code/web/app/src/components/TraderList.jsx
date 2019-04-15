import React, {Component} from "react";
import {connect} from "react-redux";
import PropTypes from "prop-types";
import {loadAll, postOne} from "../actions/apiActions";
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

const styles = (theme) => ({
    newButton: {
        width: '100%'
    }
});

class TraderList extends Component {
    state = {
        open: false
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

    handleOk = () => {
        let {dispatch} = this.props;
        dispatch(postOne(TYPE_STRATEGY, this.state.newStrat)).then(() => {
            this.handleClose();
        })
    };


    render() {
        let {classes} = this.props;
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
                                    <TableRow>
                                        <TableCell>{row.name}</TableCell>
                                        <TableCell>{row.exchange}</TableCell>
                                        <TableCell>{row.api_key}</TableCell>
                                        <TableCell align="right" ><Button color="primary">Delete</Button></TableCell>
                                    </TableRow>
                                )
                            )}</TableBody>
                    </Table>
                </Paper>
                <Dialog open={this.state.open}

                        aria-labelledby="form-dialog-title"
                >
                    <DialogTitle id="form-dialog-title">Create strategy</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Please enter the name of newly created strategy
                        </DialogContentText>
                        <FormControl>
                            <TextField
                                label="Name"
                                fullWidth
                                onChange={(e) => (
                                    this.setState({
                                        ...this.state,
                                        newStrat: {
                                            ...this.state.newStrat,
                                            name: e.target.value
                                        }
                                    })
                                )}
                            >
                                asdsa
                            </TextField>
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
        traders: state.data.traders
    };
}

export default connect(mapStoreToProps)(withStyles(styles)(TraderList));