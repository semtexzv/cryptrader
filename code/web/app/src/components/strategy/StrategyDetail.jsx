import React, {Component} from "react";
import {connect} from "react-redux";
import PropTypes from "prop-types";

import brace from 'brace/index';
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
import {postOne, loadAll, deleteOne, loadOne} from "../../actions/apiActions";
import {TYPE_ASSIGNMENT, TYPE_EVALUATION, TYPE_STRATEGY} from "../../api/baseApi";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import {Link} from "react-router-dom";
import {orm, getStrategySelector} from "../../data";
import List from "@material-ui/core/List";
import Moment from "react-moment";

const styles = (theme) => ({

    editor: {
        width: '100%'
    },
    actions: {
        float: 'right'
    },
    card: {
        marginBottom: '24px',
        overflowX: "auto"
    },

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
        if (!this.props.strategy) {
            dispatch(loadOne(TYPE_STRATEGY, this.props.match.params.id));
        }
        dispatch(loadAll(TYPE_ASSIGNMENT));
        dispatch(loadAll(TYPE_EVALUATION))
    }

    render() {
        const {dispatch, classes, match: {params}, strategy} = this.props;
        if (strategy == null) {
            return (<div>Loading</div>);
        }
        return (
            <div>
                <Card className={classes.card}>
                    <CardContent>
                        <Typography variant="title" gutterBottom align="left">Strategy script:</Typography>
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
                            {/*
                            <Button color="primary"
                                    onClick={() => dispatch(deleteOne(TYPE_STRATEGY, this.props.strategy.id))}>Delete</Button>
                                    */}
                            <Button color="primary"
                                    onClick={() => dispatch(postOne(TYPE_STRATEGY, this.props.strategy.ref))}>Save</Button>
                        </CardActions>
                    </CardContent>
                </Card>
                <Card className={classes.card}>
                    <CardContent>
                        <Typography variant="title" gutterBottom align="left">Assignments:</Typography>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Exchange</TableCell>
                                    <TableCell>Pair</TableCell>
                                    <TableCell>Period</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {this.props.assignments.map(
                                    s => (
                                        <TableRow key={s.id}>
                                            <TableCell>{s.exchange}</TableCell>
                                            <TableCell>{s.pair}</TableCell>
                                            <TableCell>{s.period}</TableCell>
                                        </TableRow>
                                    )
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
                <Card className={classes.card}>
                    <CardContent>

                        <Typography variant="title" gutterBottom align="left">Evaluations:</Typography>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Output</TableCell>
                                    <TableCell>Asset</TableCell>
                                    <TableCell>When</TableCell>
                                    <TableCell>Duration</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {this.props.evaluations.map(
                                    s => (
                                        <TableRow>
                                            <TableCell style={{minWidth: '16em'}}>{s.ok || s.error}</TableCell>
                                            <TableCell>{s.exchange}/{s.pair}/{s.period}</TableCell>
                                            <TableCell style={{whiteSpace: 'nowrap'}}><Moment fromNow  date={s.time}/></TableCell>
                                            <TableCell>{s.duration} ms</TableCell>
                                        </TableRow>
                                    )
                                )}
                            </TableBody>
                        </Table>


                    </CardContent>
                </Card>
            </div>
        )
    }
}

function mapStoreToProps(state, props) {
    let sess = orm.session(state.data.db);
    let id = props.match.params.id;
    return {
        ...props,
        strategy: getStrategySelector(id)(state.data),
        evaluations: sess.Evaluation.all().toRefArray().filter(e => e.strategy_id == id),
        assignments: sess.Assignment.all().toRefArray().filter(e => e.strategy_id == id),
    };
}

export default connect(mapStoreToProps)(withStyles(styles)(StrategyDetail));