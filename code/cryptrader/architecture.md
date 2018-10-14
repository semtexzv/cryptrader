# General architecture design

The bot will use approach similar to the on eused in prospector.
Bot will consist of several components, that communicate using channels, or eventbus.
Architecture will have a star topology, with center component being the Governor.

### The Governor
This component will only , ensure that proper components are running.
If other components crash, disconnect, or otherwise fail, it will be purpose of this 
component, to restart them. It will also control all of these components. It will be able to 
start/stop other components. And will be connected to any eventual UI.

### Historical OHLC Connections
These components will connect to the custom database or other sources that provide OHLC
data for backtesting.

### Current OHLC connections
These component s will provide up to date OHLC data upon which the trading will be done.

### Trade & Wallet connections ( Exchange connections )
These components will connect to exchange using authorization info, and will execute 
any eventual trades, these trades can fail, and must be reported.
These components will also update wallet balances.

### Data store
This component will hold live data. It will certainly hold 
wallet balances ( wallet balance will have to be deduced immediately when order is submitted,
and updated periodically). It will also hold statistics about used strategies ( current, historical ).


### Strategies
These components will evaluate custom strategies, and define what actions need to be taken
Sell/Buy/Hold. But they will also have to be written in a way , that allows their execution
on sample data using sample wallets. Sample execution for measuring strategy performance
Should not be done in core topology, There will have to be a component that translates
strategy actions into standard topology messages, And also another component that executes these 
actions on virtual wallets, with virtual data provided by historical OHLC connection.


### ZeroMq channels
OHLC PUBSUB

ohlc data: /ohlc/[stable,live]/[exchange]/[pair]
ticker data: /ticker/[exchange]/[pair]




