import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {deleteOne, loadAll, postOne} from "../../actions/apiActions";
import {
  makeStyles,
  Paper,
  TableBody,
  TableCell,
  TableRow
} from "@material-ui/core";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import Button from "@material-ui/core/Button";

import {TYPE_ASSIGNMENT, TYPE_PAIR, TYPE_STRATEGY, TYPE_TRADER} from "../../api/baseApi";
import orm from '../../data'
import EditDialog from "../util/EditDialog";

const useStyle = makeStyles((theme) => ({
  newButton: {
    width: '100%'
  },
  tableWrapper: {
    overflowX: "auto"
  }
}));


function selector(state) {

  let sess = orm.session(state.data.db);

  return {
    assignments: sess.Assignment.all().toModelArray(),
    strategies: sess.Strategy.all().toModelArray(),
    pairs: sess.Pair.all().toModelArray(),
    periods: sess.Period.all().toModelArray(),
    traders: sess.Trader.all().toModelArray(),
  };
}

function validate(newData) {
  return Boolean(newData.exchange && newData.pair && newData.period && newData.strategy_id);
}

function editorAttrs(pairs, periods, strategies, traders, setData) {
  return [
    {
      name: "asset",
      title: "Asset",
      type: "select",
      values: pairs,
      text: (e) => e.exchange + "/" + e.pair,
      isSelected: (data, e) => data.exchange == e.exchange && data.pair == e.pair,
      select: (e) => setData(data => ({
        ...data,
        pair: e ? e.pair : null,
        exchange: e ? e.exchange : null
      }))
    },
    {
      name: "period",
      title: "Period",
      type: "select",
      values: periods,
      text: (i) => i.text,
      isSelected: (data, e) => data.period == e.text,
      select: (e) => setData(data => ({
        ...data,
        period: e ? e.text : null
      }))

    },
    {
      name: "strategy_id",
      title: "Strategy",
      type: "select",
      values: strategies,
      text: (e) => e.name,
      isSelected: (data, e) => data.strategy_id == e.id,
      select: (e) => {
        setData(data => ({
          ...data,
          strategy_id: e ? e.id : null
        }))
      }
    },
    {
      name: "trader_id",
      title: "Trader",
      type: "select",
      values: traders,
      text: (e) => e.name,
      isSelected: (data, e) => data.trader_id == e.id,
      select: (e) => {
        setData(data => ({
          ...data,
          trader_id: e ? e.id : null
        }))
      }
    }
  ];
}

function AssignmentList(props) {
  const classes = useStyle(props);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [creating, setCreating] = useState(true);
  const [newData, setNewData] = useState({
    exchange: null,
    pair: null,
    period: null,
    strategy_id: null,
    trader_id: null
  });


  const {assignments, strategies, pairs, periods, traders} = useSelector(selector);
  const attrs = editorAttrs(pairs, periods, strategies, traders, setNewData);

  useEffect(() => {
    dispatch(loadAll(TYPE_PAIR));
    dispatch(loadAll(TYPE_ASSIGNMENT));
    dispatch(loadAll(TYPE_STRATEGY));
    dispatch(loadAll(TYPE_TRADER));
  }, []);


  return (<div>
    <Paper className={classes.tableWrapper}>
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
                      onClick={() => setOpen(true)}>Add new</Button>
            </TableCell>
          </TableRow>
          {assignments.map(
            row => (
              <TableRow key={row.id}>
                <TableCell>{row.pair ? row.pair.exchange : 'exchange'}</TableCell>
                <TableCell>{row.pair ? row.pair.pair : 'a'}</TableCell>
                <TableCell>{row.period}</TableCell>
                <TableCell>{row.strategy ? row.strategy.name : ""}</TableCell>
                <TableCell>{row.trader ? row.trader.name : (<i>None</i>)}</TableCell>
                <TableCell align="right">
                  <Button color="primary" onClick={() => {
                    dispatch(deleteOne(TYPE_ASSIGNMENT, row)).then(() => setOpen(false));
                  }}>Delete</Button>
                </TableCell>
              </TableRow>
            )
          )}</TableBody>
      </Table>
    </Paper>
    <EditDialog
      open={open}
      valid={validate(newData)}
      title="Assignment"
      text="Create new assignment"
      data={newData}
      onData={d => setNewData(d)}
      onDismiss={save => {
        if (save) {
          dispatch(postOne(TYPE_ASSIGNMENT, newData)).then(() => {
            setOpen(false);
            setNewData({});
          })
        } else {
          setOpen(false);
          setNewData({});
        }
      }}
      onDelete={creating ? null : e => {
        dispatch(deleteOne(TYPE_ASSIGNMENT, e)).then(() => setOpen(false))
      }}
      attrs={attrs}
    />
  </div>)
}

export default AssignmentList;