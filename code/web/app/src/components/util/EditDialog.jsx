import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl, makeStyles, Select,
  TextField
} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import React from "react";
import * as PropTypes from "prop-types";
import InputLabel from "@material-ui/core/InputLabel";
import {useDispatch} from "react-redux";


const useStyle = makeStyles(theme => ({
  'DialogActions': {
    display: 'flex'
  },

  'deleteButton': {
    textColor: theme.danger,
    marginRight: 'auto'
  }
}));

const defaultProps = {
  open: false,
  valid: true,
  title: "Edit",
  text: "Edit dialog",
  data: {},
  attrs: [],
  onDismiss: () => {

  },
  onData: () => {

  },
  validate: (d) => {
    return true
  }
};


function EditDialog(props) {
  const dispatch = useDispatch();
  const classes = useStyle(props);
  props = {...defaultProps, ...props};
  let {open, data, attrs, title, text, onDismiss, onData, onDelete} = props;

  const handleElemSelect = (attr, event) => {
    let {data, onData} = props;
    let index = event.target.selectedIndex;
    let val = attr.values[index - 1];

    if (attr.select) {
      attr.select(val)
    } else {
      data[attr.name] = val;
      onData(data);
    }
  };

  let deleteButton = null;
  if (onDelete) {
    deleteButton = (<Button className={classes.deleteButton} onClick={() => onDelete(data)}>Delete</Button>);
  }
  return (<div>
    <Dialog open={open} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{text}</DialogContentText>
        {attrs.map(attr => {
          if (attr.type == "text") {
            return (<FormControl
              key={attr.name}
              fullWidth
              margin="dense"
            >
              <TextField
                label={attr.title}
                onChange={(e) => {
                  data[attr.name] = e.target.value;
                  onData(Object.assign({}, data));
                }}
                value={data[attr.name] ? data[attr.name] : ''}
              />
            </FormControl>)
          } else if (attr.type == "select") {
            return (
              <FormControl
                key={attr.name}
                fullWidth
                margin='dense'
              >
                <InputLabel>{attr.title}</InputLabel>
                <Select
                  native
                  onChange={e => handleElemSelect(attr, e)}
                  defaultValue={attr.values.filter(v => data[attr.name] == v || (attr.isSelected ? attr.isSelected(data, v) : false))[0]}
                >
                  <option value=""/>

                  {attr.values.map(v => {
                    let selected = data[attr.name] == v;
                    if (attr.isSelected != null && attr.isSelected(data, v)) {
                      selected = true;
                    }
                    return (<option key={v.name} value={v}>{attr.text(v)}</option>)
                  })}
                </Select>

              </FormControl>)
          } else {
            return (<div>Invalid type</div>)
          }

        })}
      </DialogContent>
      <DialogActions className={classes.DialogActions}>
        {deleteButton}
        <Button color="primary" onClick={e => onDismiss(false)}>Cancel</Button>
        <Button color="primary" onClick={e => onDismiss(true)} disabled={!props.valid}>Ok</Button>
      </DialogActions>
    </Dialog>
  </div>);
}

export default EditDialog;

