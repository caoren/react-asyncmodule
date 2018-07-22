import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Link } from 'react-router-dom'; // eslint-disable-line
import AsyncModule from '../src/index';

const Loading = () => (<div className="f-fullhg"><div className="m-loading">加载中...</div></div>);
const ErrorView = ({ onRetry }) => (<div className="f-fullhg"><div className="m-error" onClick={onRetry}>加载失败</div></div>);

const AsyncComponent = AsyncModule({
    loading: <Loading />,
    error: <ErrorView />
});

const Home = AsyncComponent({
    load: () => import(/* webpackChunkName: "home" */ './views/home'),
    resolveWeak: () => require.resolveWeak('./views/home')
});

const List = AsyncComponent({
    load: () => import(/* webpackChunkName: "list" */ './views/list'),
    resolveWeak: () => require.resolveWeak('./views/list')
});
Home.preload();
class App extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <BrowserRouter>
                <div>
                    <Route exact path="/" component={Home} />
                    <Route exact path="/list" component={List} />
                </div>
            </BrowserRouter>
        );
    }
}
ReactDOM.render(
    <App />,
    document.getElementById('J_wrap')
);