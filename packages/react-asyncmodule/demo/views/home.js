import React, { Component } from 'react';
import { Link } from 'react-router-dom'; // eslint-disable-line

class Home extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        console.log('=props=', this.props);
        return (
            <React.Fragment>
                <div className="m-home">
                    <Link to="/list">列表</Link>
                </div>
                <div>
                    我是首页
                </div>
            </React.Fragment>
        );
    }
}
Home.fetchData = () => ({ a: 1 });
export default Home;