import React, {Component, useEffect} from "react";
import {Grid, Table, TableRow, Typography} from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import withStyles from "@material-ui/core/es/styles/withStyles";
import connect from "react-redux/es/connect/connect";
import {loadAll} from "../../actions/apiActions";
import {TYPE_ASSIGNMENT, TYPE_EVALUATION, TYPE_PAIR, TYPE_STRATEGY, TYPE_TRADE, TYPE_TRADER} from "../../api/baseApi";
import orm from '../../data'
import TableHead from "@material-ui/core/TableHead";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import {makeStyles, useStyles} from "@material-ui/styles";
import Moment from "react-moment";
import {useDispatch, useSelector} from "react-redux";
import Button from "@material-ui/core/Button";

const styles = makeStyles({
  title: {
    textAlign: 'left',
  },
  placeholder: {
    margin: '64px',
  },
  tableWrapper: {
    overflowX: "auto",
    width: '100%'
  },
  cardContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'center'
  }
});


function homeSelector(state) {
  let sess = orm.session(state.data.db);
  return {
    strategies: sess.Strategy.all().toModelArray(),
    traders: sess.Trader.all().toModelArray(),
    trades: sess.Trade.all().toModelArray(),
    assignments: sess.Assignment.all().toModelArray(),
    evaluations: sess.Evaluation.all().toModelArray(),
  }
}

function NextStep(props) {
  const {strategies, assignments, evaluations, traders, trades} = props
  if (strategies.length == 0) {
    return (<Button color='primary' to="/app/strategies">Create a strategy</Button>)
  } else if (assignments.length == 0) {
    return (<Button color='primary' to="/app/assignments">Assign a strategy to an asset</Button>)
  } else if (traders.length == 0) {
    return (<Button color='primary' to="/app/traders">Create a trading account</Button>)
  } else if (assignments.filter(e => e.trader_id).length == 0) {
    return (<Button color='primary' to="/app/assignments">Assign a trader to an asset</Button>)
  } else {
    return (<>Everything ready, system should be evaluating strategies and attempting to trade</>);
  }
}

export function Home(props) {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(loadAll(TYPE_EVALUATION));
    dispatch(loadAll(TYPE_ASSIGNMENT));
    dispatch(loadAll(TYPE_TRADE));
    dispatch(loadAll(TYPE_STRATEGY));
    dispatch(loadAll(TYPE_TRADER));
    dispatch(loadAll(TYPE_PAIR));
  }, []);

  const classes = styles(props);
  const data = useSelector(homeSelector);
  const {strategies, assignments, evaluations, traders, trades} = data;

  let evalBody = (
    <Typography component="p" color='textSecondary' className={classes.placeholder}>
      No data available
    </Typography>
  );
  if (evaluations.length != 0) {
    evalBody = (<div className={classes.tableWrapper}><Table>
      <TableHead>
        <TableRow>
          <TableCell>Strategy</TableCell>
          <TableCell>Asset</TableCell>
          <TableCell>When</TableCell>
          <TableCell>Result</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {evaluations.map(e => {
          let res = e.ok;

          if (!e.status) {
            res = "Error";
          }
          return <TableRow key={e.id}>
            <TableCell>{e.strategy ? e.strategy.name : ""}</TableCell>
            <TableCell>{e.exchange}/{e.pair}/{e.period}</TableCell>
            <TableCell style={{whiteSpace: 'nowrap'}}><Moment fromNow date={e.time}/></TableCell>
            <TableCell>{res}</TableCell>

          </TableRow>;
        })}
      </TableBody>
    </Table></div>)
  }

  let tradeBody = (
    <Typography component="p" color='textSecondary' className={classes.placeholder}>
      No data available
    </Typography>
  );

  if (trades.length != 0) {
    tradeBody = (<div className={classes.tableWrapper}><Table>
      <TableHead>
        <TableRow>
          <TableCell>Asset</TableCell>
          <TableCell>Trader</TableCell>
          <TableCell>When</TableCell>
          <TableCell>Result</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {trades.map(e => {
          let res = e.status ? (e.buy ? "Buy" : "Sell") : "Error: " + e.error;
          return <TableRow key={e.id}>
            <TableCell>{e.exchange}/{e.pair}</TableCell>
            <TableCell>{e.trader ? e.trader.name : "-"}</TableCell>
            <TableCell style={{whiteSpace: 'nowrap'}}><Moment fromNow date={e.time}/></TableCell>
            <TableCell>{res}</TableCell>

          </TableRow>;
        })}
      </TableBody>
    </Table></div>)
  }
  return (<div>
    <Grid container spacing={4} justify="space-evenly" alignItems="center">
      <Grid item xs={12} sm={12}>
        <Card>
          <CardContent>
            <Typography
              variant="h5"
              gutterBottom
              component="h2"
              className={classes.title}
            >Next step</Typography>
            <div className={classes.cardContainer}>
              <Typography component="p" color='textSecondary' className={classes.placeholder}>
                <NextStep {...data}/>
              </Typography>
            </div>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography
              variant="h5"
              gutterBottom
              component="h2"
              className={classes.title}
            >Strategy evaluations</Typography>
            <div className={classes.cardContainer}>
              {evalBody}
            </div>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography

              variant="h5"
              gutterBottom
              component="h2"
              className={classes.title}
            >Trades executed</Typography>
            <div className={classes.cardContainer}>
              {tradeBody}
            </div>
          </CardContent>
        </Card>
      </Grid>

    </Grid>
  </div>)

}


export default Home;