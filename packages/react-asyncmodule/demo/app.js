import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom'; // eslint-disable-line
// import { hot } from 'react-hot-loader'; // eslint-disable-line
import AsyncModule from '../src/index';

const Loading = (<div className="f-fullhg"><div className="m-loading">加载中...</div></div>);
const ErrorView = ({ onRetry }) => (<div className="f-fullhg"><div className="m-error" onClick={onRetry}>加载失败</div></div>);

const AsyncComponent = AsyncModule({
    loading: Loading,
    error: <ErrorView />,
    onModuleLoaded: (comp, chunkName, isServer, setState) => {
        console.log(comp, chunkName, isServer);
        const data = comp.fetchData();
        setState({
            other: data
        });
    }
});

const Home = AsyncComponent(import(/* webpackChunkName: "home" */ './views/home'));
const List = AsyncComponent(import(/* webpackChunkName: "list" */ './views/list'));

class App extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <BrowserRouter>
                <div>
                    <Route exact path="/list" component={List} />
                    <Route exact path="/" component={Home} />
                </div>
            </BrowserRouter>
        );
    }
}
export default App;