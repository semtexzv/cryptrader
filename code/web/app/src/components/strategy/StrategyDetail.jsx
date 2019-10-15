import React, {Component, useEffect, useState} from "react";
import {connect, useDispatch, useSelector} from "react-redux";
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
  CardContent, CardHeader, makeStyles,
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
import {orm, getStrategySelector} from "../../data";
import Moment from "react-moment";

const useStyle = makeStyles((theme) => ({
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

}));

function makeDetailSelector(id) {
  return function (state) {
    let sess = orm.session(state.data.db);
    return {
      strategy: getStrategySelector(id)(state.data),
      evaluations: sess.Evaluation.all().toRefArray().filter(e => e.strategy_id == id),
      assignments: sess.Assignment.all().toModelArray().filter(e => e.strategy_id == id),
    };
  }
}


function StrategyDetail(props) {
  const dispatch = useDispatch();
  const classes = useStyle(props);
  const {strategy, evaluations, assignments} = useSelector(makeDetailSelector(props.id));


  useEffect(() => {
    if (!strategy) {
      dispatch(loadOne(TYPE_STRATEGY, props.id));
    }
    dispatch(loadAll(TYPE_ASSIGNMENT));
    dispatch(loadAll(TYPE_EVALUATION))
  }, [props.id]);



  const onChange = (text) => {
    strategy.body = text
    //console.log(props)
  };


  if (strategy == null) {
    return (<div>Loading</div>);
  }

  return (
    <div>
      <Card className={classes.card}>
        <CardContent>
          <Typography variant="h5" gutterBottom align="left">Strategy script:</Typography>
          <AceEditor
            placeholder="Placeholder Text"
            mode="lua"
            theme="dreamweaver"
            name="Code"
            onChange={onChange}
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
                    onClick={() => dispatch(deleteOne(TYPE_STRATEGY, strategy.id))}>Delete</Button>

            <Button color="primary"
                    onClick={() => dispatch(postOne(TYPE_STRATEGY, strategy.ref))}>Save</Button>
          </CardActions>
        </CardContent>
      </Card>
      <Card className={classes.card}>
        <CardContent>
          <Typography variant="h6" gutterBottom align="left">Assignments:</Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Exchange</TableCell>
                <TableCell>Pair</TableCell>
                <TableCell>Period</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {assignments.map(
                s => (
                  <TableRow key={s.id}>
                    <TableCell>{s.pair ? s.pair.exchange : '' }</TableCell>
                    <TableCell>{s.pair ? s.pair.pair : '' }</TableCell>
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

          <Typography variant="h6" gutterBottom align="left">Evaluations:</Typography>
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
              {evaluations.map(
                s => (
                  <TableRow key={s.id}>
                    <TableCell style={{minWidth: '16em'}}>{s.ok || s.error}</TableCell>
                    <TableCell>{s.exchange}/{s.pair}/{s.period}</TableCell>
                    <TableCell style={{whiteSpace: 'nowrap'}}><Moment fromNow date={s.time}/></TableCell>
                    <TableCell>{s.duration} ms</TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>


        </CardContent>
      </Card>
    </div>
  );
}

export default StrategyDetail;