import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControl, Select,
    TextField
} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import React from "react";
import * as PropTypes from "prop-types";
import InputLabel from "@material-ui/core/InputLabel";

const attrShape = PropTypes.shape({
    type: PropTypes.string,
    title: PropTypes.string,
    name: PropTypes.string,

});

class EditDialog extends React.Component {

    static defaultProps = {
        open: false,
        title: "Edit",
        text: "Edit dialog",
        data: {},
        attrs: [],
        onDismiss: () => {

        },
        onData: () => {

        }
    };

    static propTypes = {
        open: PropTypes.bool,
        title: PropTypes.string,
        text: PropTypes.string,
        data: PropTypes.object,
        attrs: PropTypes.array,
        onDismiss: PropTypes.func,
        onData: PropTypes.func,
    };

    handleElemSelect(attr, event) {
        let {data, onData} = this.props;
        let val = attr.values[event.target.selectedIndex - 1];

        if (attr.select) {
            attr.select(val)
        } else {
            data[attr.name] = val;
            onData(data);
        }
    }


    render() {
        let {open, data, attrs, title, text, onDismiss, onData} = this.props;
        return (<div><Dialog open={open} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">{title}</DialogTitle>
            <DialogContent>
                <DialogContentText>{text}</DialogContentText>
                {attrs.map(attr => {
                    if (attr.type == "text") {
                        return (<FormControl
                            fullWidth
                            margin="dense"
                        >
                            <TextField
                                label={attr.title}
                                onChange={(e) => {
                                    data[attr.name] = e.target.value;
                                    onData(data);
                                }}
                                value={data[attr.name]}
                            />
                        </FormControl>)
                    } else if (attr.type == "select") {
                        return (<FormControl fullWidth>
                            <InputLabel>{attr.title}</InputLabel>
                            <Select
                                native
                                onChange={e => this.handleElemSelect(attr, e)}
                            >
                                <option value=""/>

                                {attr.values.map(v => {
                                    let selected = data[attr.name] == v;
                                    if (attr.isSelected != null && attr.isSelected(data, v)) {
                                        selected = true;
                                    }
                                    return (<option selected={selected} value={v}>{attr.text(v)}</option>)
                                })}
                            </Select>

                        </FormControl>)
                    } else {
                        return (<div>Invalid type</div>)
                    }

                })}
            </DialogContent>
            <DialogActions>
                <Button color="primary" onClick={e => onDismiss(false)}>Cancel</Button>
                <Button color="primary" onClick={e => onDismiss(true)}>Ok</Button>
            </DialogActions>
        </Dialog>
        </div>);
    }
}


export default EditDialog;

