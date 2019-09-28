import React, {useState} from 'react';
import PropTypes from 'prop-types';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import {signin, signup} from "../../actions/authActions";
import {connect, useDispatch} from "react-redux";
import {makeStyles} from "@material-ui/core";

const useStyle = makeStyles(theme => ({
  main: {
    width: 'auto',
    display: 'block', // Fix IE 11 issue.
    marginLeft: theme.spacing(3),
    marginRight: theme.spacing(3),
    [theme.breakpoints.up(400 + theme.spacing(3) * 2)]: {
      width: 400,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing(2)}px ${theme.spacing(3)}px ${theme.spacing(3)}px`,
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    marginTop: theme.spacing(3),
  },
}));

function Auth(props) {
  let classes = useStyle();
  let dispatch = useDispatch();

  let [method, setMethod] = useState(() => signin);

  return (
    <main className={classes.main}>
      <CssBaseline/>
      <Paper className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon/>
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <form className={classes.form} id="auth-form" method="post" onSubmit={e => {
          e.preventDefault();
          let data = new FormData(e.target);

          let dataObj = {};
          for (var [key, value] of data.entries()) {
            dataObj[key] = value
          }
          const action = method(dataObj);

          dispatch(action);
          console.log("Submitted");
        }}>
          <FormControl margin="dense" required fullWidth>
            <InputLabel htmlFor="email">Email Address</InputLabel>
            <Input id="email" name="email" autoComplete="email" autoFocus/>
          </FormControl>
          <FormControl margin="dense" required fullWidth>
            <InputLabel htmlFor="password">Password</InputLabel>
            <Input name="password" type="password" id="password" autoComplete="current-password"/>
          </FormControl>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            formAction="/api/signin/"
            onClick={e => setMethod(() => signin)}
          >
            Sign in
          </Button>
          <Button
            type="submit"
            fullWidth
            variant="text"
            color="primary"
            className={classes.submit}
            formAction="/api/signup/"
            onClick={e => setMethod(() => signup)}
          >
            Sign up
          </Button>
          <Typography>Errors go here</Typography>
        </form>
      </Paper>
    </main>
  );

}

export default Auth;