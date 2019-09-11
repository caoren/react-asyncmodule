import React, { Component } from 'react';
import { Link } from 'react-router-dom'; // eslint-disable-line

class Home extends Component {
    constructor(props) {
        super(props);
    }
    render() {
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
Home.fetchData = () => {
    console.log('=home=');
};
export default Home;