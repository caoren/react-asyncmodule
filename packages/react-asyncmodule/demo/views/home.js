import React, { Component } from 'react';
import { Link } from 'react-router-dom'; // eslint-disable-line

class Home extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div className="m-home">
                首页<br />
                <Link to="/list">列表</Link>
            </div>
        );
    }
}
Home.fetchData = () => {
    console.log('=home=');
};
export default Home;