import React, { Component } from 'react';

export default class LinksBlock extends Component {
    constructor(props) {
        super(props);
        this.getInfo = this.getInfo.bind(this);
    }

    getInfo() {
        return (<div>
            {this.props.artist}<br/>
            {this.props.track}<br/>
            {this.props.url}<br/>
        </div>)
    }



    render() {
        return (
            <div className="LinksBlock">
            <this.getInfo/>
            </div>
        )
    }
}