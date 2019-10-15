import React, { useEffect, useState} from "react";
import { useDispatch, useSelector} from "react-redux";
import {deleteOne, loadAll, postOne} from "../../actions/apiActions";
import {
  makeStyles,
  Paper,
  TableBody,
  TableCell,
  TableRow, TextField
} from "@material-ui/core";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import Button from "@material-ui/core/Button";
import {TYPE_TRADER} from "../../api/baseApi";
import EditDialog from "../util/EditDialog";
import orm from "../../data";

const useStyle = makeStyles((theme) => ({
  newButton: {
    width: '100%'
  },
  cell: {
    minWidth: '10em'
  },
  tableWrapper: {
    overflowX: "auto"
  }
}));


const exchanges = ["bitfinex"];

function selector(state) {
  let sess = orm.session(state.data.db);
  return sess.Trader.all().toRefArray();
}

function validate(data) {
  return Boolean(data.name
    && data.exchange
    && data.api_key
    && data.api_secret)
}

function TraderList(props) {
  const dispatch = useDispatch();
  const classes = useStyle(props);
  const traders = useSelector(selector);

  const [open, setOpen] = useState(false);
  const [creating, setCreating] = useState(true);
  const [newData, setNewData] = useState({});

  useEffect(() => {
    dispatch(loadAll(TYPE_TRADER))
  }, []);

  const handleClickOpen = () => {
    setOpen(true);
    setCreating(true);
  };

  const handleClose = () => {
    setOpen(false)
  };

  let onDeleteCb = null;

  if (!creating) {
    onDeleteCb = e => dispatch(deleteOne(TYPE_TRADER, e)).then(() => setOpen(false))
  }

  return (
    <div>
      <Paper className={classes.tableWrapper}>
        <Table>

          <TableHead>
            <TableRow>
              <TableCell className={classes.cell}>Name</TableCell>
              <TableCell className={classes.cell}>Exchange</TableCell>
              <TableCell className={classes.cell}>Key</TableCell>
              <TableCell className={classes.cell} style={{minWidth: '15em'}}
                         align='right'>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell colSpan="10">
                <Button variant="text" color="primary" className={classes.newButton}
                        onClick={handleClickOpen}>Add new</Button>
              </TableCell>
            </TableRow>
            {traders.map(
              row => (
                <TableRow key={row.id}>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.exchange}</TableCell>
                  <TableCell>{row.api_key}</TableCell>
                  <TableCell align="right">
                    <Button color="primary"
                            onClick={e => {
                              setOpen(true);
                              setCreating(false);
                              setNewData(row);
                            }}
                    >Edit</Button>
                  </TableCell>
                </TableRow>
              )
            )}</TableBody>
        </Table>
      </Paper>
      <EditDialog
        open={open}
        valid={validate(newData)}
        data={newData}
        title="New trader"
        text="Create a new trading account"
        onData={(d) => setNewData(Object.assign({}, d ))}
        onDelete={onDeleteCb}
        attrs={[
          {name: "name", title: "Name", type: "text"},
          {name: "api_key", title: "Api key", type: "text"},
          {name: "api_secret", title: "Api secret", type: "text"},
          {
            name: "exchange", title: "Exchange", type: "select",
            values: exchanges,
            text: (e) => e,
          }
        ]}
        onDismiss={(save) => {
          setOpen(false);
          if (save) {
            dispatch(postOne(TYPE_TRADER,  newData)).then(() => setOpen(false))
          }
        }}

      />


    </div>)
}

export default TraderList;