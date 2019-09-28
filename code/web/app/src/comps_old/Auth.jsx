import React from 'react';
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
import {signin, signup} from "../actions/authActions";
import {connect} from "react-redux";

const styles = theme => ({
    main: {
        width: 'auto',
        display: 'block', // Fix IE 11 issue.
        marginLeft: theme.spacing.unit * 3,
        marginRight: theme.spacing.unit * 3,
        [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
            width: 400,
            marginLeft: 'auto',
            marginRight: 'auto',
        },
    },
    paper: {
        marginTop: theme.spacing.unit * 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
    },
    avatar: {
        margin: theme.spacing.unit,
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing.unit,
    },
    submit: {
        marginTop: theme.spacing.unit * 3,
    },
});

class Auth extends React.Component {


    render() {
        let {classes, dispatch, errors} = this.props;
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

                        dispatch(this.state.method(dataObj));
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
                            onClick={(e) => {
                                this.setState({method: signin})
                            }}
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
                            onClick={e => {
                                this.setState({method: signup})
                            }}
                        >
                            Sign up
                        </Button>
                        <Typography>{errors}</Typography>
                    </form>
                </Paper>
            </main>
        );
    }
}

function mapStateToProps(state) {
    return {
        errors: state.info.errors
    }

}

export default connect(mapStateToProps)(withStyles(styles)(Auth));
