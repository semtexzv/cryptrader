import React, { useEffect, useState} from "react";
import { useDispatch, useSelector} from "react-redux";
import {
  makeStyles,
  Paper,
  TableBody,
  TableCell,
  TableRow,

} from "@material-ui/core";
import Table from "@material-ui/core/Table/index";
import TableHead from "@material-ui/core/TableHead/index";
import Button from "@material-ui/core/Button/index";
import {loadAll, postOne} from "../../actions/apiActions";
import {TYPE_STRATEGY} from "../../api/baseApi";
import orm from "../../data";
import EditDialog from "../util/EditDialog";

const useStyle = makeStyles((theme) => ({
  newButton: {
    width: '100%'
  },
  tableWrapper: {
    overflowX: "auto"
  }
}));


function listSelector(state) {
  let sess = orm.session(state.data.db);
  return sess.Strategy.all().toRefArray();
}

function StrategyList(props) {
  const dispatch = useDispatch();
  const classes = useStyle(props);

  const [open, setOpen] = useState(false);
  const [newStrat, setNewStrat] = useState({name: "", body: ""});

  const strategies = useSelector(listSelector);

  useEffect(() => {
    dispatch(loadAll(TYPE_STRATEGY));
  }, []);

  const save = () => {
    dispatch(postOne(TYPE_STRATEGY, newStrat)).then(() => setOpen(false))
  };

  return (<div>
    <Paper className={classes.tableWrapper}>
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
                      onClick={() => setOpen(true)}>Add new</Button>
            </TableCell>
          </TableRow>
          {strategies.map(
            row => (
              <TableRow key={row.id}>
                <TableCell>
                  {row.name}
                </TableCell>
                <TableCell align="right">
                  <Button to={`/app/strategies/${row.id}`} color="primary">Edit</Button>
                </TableCell>
              </TableRow>
            )
          )}
        </TableBody>
      </Table>
    </Paper>
    <EditDialog open={open}
                valid={newStrat.name}
                title="New strategy"
                text="Create new strategy"
                data={newStrat}
                onData={d => setNewStrat(d)}
                onDismiss={save => {
                  if (save) {
                    save();
                  } else {
                    setOpen(false);
                  }
                }}
                attrs={[{name: "name", title: "Name", type: "text"}]}
    />
  </div>)
}

export default StrategyList;