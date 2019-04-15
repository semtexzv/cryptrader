import React, {Component} from "react";
import {connect} from "react-redux";
import PropTypes from "prop-types";

import brace from 'brace';
import AceEditor from 'react-ace';

import 'brace/mode/lua';
import 'brace/theme/dreamweaver';
import 'brace/ext/language_tools';

import {withStyles} from "@material-ui/styles";
import {
    Button,
    CardActionArea,
    CardActions,
    CardContent, CardHeader,
    Paper,
    TableBody,
    TableCell,
    TableRow, Typography
} from "@material-ui/core";
import Card from "@material-ui/core/Card";
import {postOne, loadAll, deleteOne} from "../actions/apiActions";
import {TYPE_ASSIGNMENT, TYPE_EVALUATIONS, TYPE_STRATEGY} from "../api/baseApi";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import {Link} from "react-router-dom";

const styles = (theme) => ({

    editor: {
        width: '100%'
    },
    actions: {
        float: 'right'
    }
});

class StrategyDetail extends Component {
    static propTypes = {
        strategy: PropTypes.object
    };

    static defaultProps = {
        strategy: {},
        evaluations: [],
        assignments: [],
    };

    onLoad = () => {

    };

    onChange = (text) => {
        this.props.strategy.body = text;
        console.log(this.props)

    };

    componentDidMount() {
        let {dispatch} = this.props;
        dispatch(loadAll(TYPE_ASSIGNMENT));
        dispatch(loadAll(TYPE_EVALUATIONS))
    }

    render() {
        const {dispatch, classes, match: {params}, strategy} = this.props;
        const {id} = params;
        return (
            <Card>
                <CardContent>
                    <AceEditor
                        placeholder="Placeholder Text"
                        mode="lua"
                        theme="dreamweaver"
                        name="Code"
                        onLoad={this.onLoad}
                        onChange={this.onChange}
                        fontSize={14}
                        showPrintMargin={true}
                        showGutter={true}
                        highlightActiveLine={true}
                        value={strategy.body}
                        className={classes.editor}
                        style={{width: '100%'}}

                        setOptions={{
                            enableBasicAutocompletion: true,
                            enableLiveAutocompletion: true,
                            enableSnippets: true,
                            showLineNumbers: true,
                            tabSize: 2,
                        }}/>
                    <CardActions className={classes.actions}>
                        <Button color="primary"
                                onClick={() => dispatch(deleteOne(TYPE_STRATEGY, this.props.strategy.id))}>Delete</Button>
                        <Button color="primary"
                                onClick={() => dispatch(postOne(TYPE_STRATEGY, this.props.strategy))}>Save</Button>
                    </CardActions>
                    <Typography variant="title" gutterBottom align="left">Assignments:</Typography>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Pair</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.props.assignments.map(
                                s => (
                                    <TableRow>
                                        <TableCell>{s.pair}</TableCell>
                                    </TableRow>
                                )
                            )}
                        </TableBody>
                    </Table>

                    <Typography variant="title" gutterBottom align="left">Evaluations:</Typography>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Output</TableCell>
                                <TableCell>Exchange</TableCell>
                                <TableCell>Pair</TableCell>
                                <TableCell>Time</TableCell>
                                <TableCell>Duration</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.props.evaluations.map(
                                s => (
                                    <TableRow>
                                        <TableCell>{s.ok || s.error}</TableCell>
                                        <TableCell>{s.exchange}</TableCell>
                                        <TableCell>{s.pair}</TableCell>
                                        <TableCell>{s.time}</TableCell>
                                        <TableCell>{s.duration}</TableCell>
                                    </TableRow>
                                )
                            )}
                        </TableBody>
                    </Table>


                </CardContent>
            </Card>
        )
    }
}

function mapStoreToProps(state, props) {
    let id = props.match.params.id;
    return {
        ...props,
        strategy: state.data.strategies.filter(a => a.id == id)[0],
        evaluations: state.data.evaluations.filter(a => a.strategy_id == id),
        assignments: state.data.assignments.filter(a => a.strat_id == id),
    };
}

export default connect(mapStoreToProps)(withStyles(styles)(StrategyDetail));