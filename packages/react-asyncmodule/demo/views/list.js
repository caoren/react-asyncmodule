import React, { Component } from 'react';

class List extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tab: 0
        };
        this.changeTabf = this.changeTab(0).bind(this);
        this.changeTabs = this.changeTab(1).bind(this);
    }
    changeTab(n) {
        return (e) => {
            this.setState({
                tab: n
            });
        };
    }
    render() {
        const { tab } = this.state;
        return (
            <div className="m-home">
                <div>
                    <span onClick={this.changeTabf}>tab1</span>
                    <span onClick={this.changeTabs}>tab2</span>
                </div>
                <p>选中{tab}</p>
                <p>列表3454678</p>
            </div>
        );
    }
}
export default List;