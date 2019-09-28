import React, {Suspense} from "react";
import {useRoutes, navigate} from 'hookrouter'
import {LinkHeaderMenuItem} from "../links";

import './App.scss'
import {Content} from "carbon-components-react";
import {
    Header, HeaderName, HeaderNavigation, HeaderGlobalAction, HeaderGlobalBar
} from "carbon-components-react/lib/components/UIShell";
import {Search20, Notification20, UserAvatar20} from "@carbon/icons-react";

const Status = React.lazy(() => import('../status/status'));
const StrategyList = React.lazy(() => import('../strategy/list'));
const TraderList = React.lazy(() => import('../strategy/list'));

const renderFallback = () => {
    return (<div>Loading</div>)
};

const routes = {
    '/app': () => (<div>Root</div>),
    '/app/status': () => (
        <Suspense fallback={renderFallback()} >
            <Status />
        </Suspense>
    ),
    '/app/strategies': () => (
        <Suspense fallback={renderFallback()} >
            <StrategyList/>
        </Suspense>
        ),
    '/app/strategies/:id': ({id}) => (<div>Strat detail {id}</div>),
    '/app/traders': () => (
        <Suspense fallback={renderFallback()} >
            <TraderList />
        </Suspense>
    ),

};

const App = () => {
    const route = useRoutes(routes);
    return (
        <div className="container">
            <Header aria-label="cryptrader">
                <HeaderName href="/app" prefix="">
                    Cryptrader
                </HeaderName>
                <HeaderNavigation aria-label="cryptrader">
                    <LinkHeaderMenuItem aria-label="strats" href="/app/status">Status</LinkHeaderMenuItem>
                    <LinkHeaderMenuItem aria-label="strats" href="/app/strategies">Strategies</LinkHeaderMenuItem>
                    <LinkHeaderMenuItem aria-label="strats" href="/app/traders">Traders</LinkHeaderMenuItem>
                </HeaderNavigation>
                <HeaderGlobalBar>
                    <HeaderGlobalAction aria-label="Notifications" onClick={() => {
                        navigate("/app/status?notifications=true")
                    }}>
                        <Notification20 />
                    </HeaderGlobalAction>
                    <HeaderGlobalAction aria-label="Account" onClick={() => {
                        navigate("/app/account")
                    }}>
                        <UserAvatar20 />
                    </HeaderGlobalAction>
                </HeaderGlobalBar>
            </Header>
            <Content>
            <div className="bx--grid">

                    {route || (<div> No content</div>)}

            </div>
            </Content>
        </div>
    )
};


export default App;