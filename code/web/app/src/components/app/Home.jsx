import React, {Component} from "react";
import {Grid, Typography} from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import withStyles from "@material-ui/core/es/styles/withStyles";
import connect from "react-redux/es/connect/connect";
import {loadAll} from "../../actions/apiActions";
import {TYPE_ASSIGNMENT, TYPE_PAIR, TYPE_STRATEGY, TYPE_TRADER} from "../../api/baseApi";
import orm from '../../data'
import Button from "@material-ui/core/Button";
import {NavLink} from "react-router-dom";

const styles = theme => ({
    title: {
        textAlign: 'left',
    },
    placeholder: {
        margin: '48px',
        marginTop: '64px'
    }
});

class Home extends Component {
    componentDidMount() {
        let {dispatch} = this.props;
        dispatch(loadAll(TYPE_ASSIGNMENT));
        dispatch(loadAll(TYPE_STRATEGY));
        dispatch(loadAll(TYPE_TRADER));
        dispatch(loadAll(TYPE_PAIR));
    }

    render() {
        const {classes} = this.props;
        const {strategies, assignments} = this.props;

        let nextStep = "";

        if (strategies.length == 0) {
            nextStep = <Button component={NavLink} to="/app/strategies">Create a strategy</Button>
        } else if (assignments.length == 0) {
            nextStep = <Button component={NavLink} to="/app/assignments">Assign a strategy to an asset</Button>
        } else {
            nextStep = "Everything ready";
        }
        return (<div>
            <Grid container spacing={24}>
                <Grid item xs={12} sm={12}>
                    <Card>
                        <CardContent>
                            <Typography
                                variant="h5"
                                gutterBottom
                                component="h2"
                                className={classes.title}
                            >Next step</Typography>

                            <Typography component="p" color='textSecondary' className={classes.placeholder}>
                                {nextStep}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Card>
                        <CardContent>
                            <Typography
                                variant="h5"
                                gutterBottom
                                component="h2"
                                className={classes.title}
                            >Strategy evaluations</Typography>
                            <Typography component="p" color='textSecondary' className={classes.placeholder}>
                                No data available
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Card>
                        <CardContent>
                            <Typography
                                variant="h5"
                                gutterBottom
                                component="h2"
                                className={classes.title}
                            >Trades executed</Typography>
                            <Typography component="p" color='textSecondary' className={classes.placeholder}>
                                No data available
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

            </Grid>
        </div>)
    }
}

function mapStateToProps(state) {
    let sess = orm.session(state.data.db);
    return {
        strategies: sess.Strategy.all().toRefArray(),
        assignments: sess.Assignment.all().toRefArray(),
    }

}

export default connect(mapStateToProps)(withStyles(styles)(Home));