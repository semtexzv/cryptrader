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
import {postOne} from "../../actions/apiActions";
import {TYPE_STRATEGY} from "../../api/baseApi";
import orm, {allStrategiesSelector} from "../../data";
import EditDialog from "../EditDialog";


const styles = (theme) => ({
    newButton: {
        width: '100%'
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

    render() {
        let {classes} = this.props;
        return (<div>
            <Paper>
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
                                <TableRow>
                                    <TableCell>
                                        {row.name}
                                    </TableCell>
                                    <TableCell align="right">
                                        <Button component={Link} to={`/app/strategies/${row.id}`} variant="contained"
                                                color="primary">Edit</Button>
                                    </TableCell>
                                </TableRow>
                            )
                        )}
                    </TableBody>
                </Table>
            </Paper>
            <EditDialog open={this.state.open}
            />
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
    let sess = orm.session(state.data.db);
    return {
        strategies: sess.Strategy.all().toRefArray()
    };

}

export default connect(mapStoreToProps)(withStyles(styles)(StrategyList));