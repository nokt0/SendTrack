import React, { Component } from 'react';
import PropTypes from 'prop-types';

import * as STlib from '../SendTrack_lib.js';

export default class InputForm extends Component {

    static propTypes = {
        content: PropTypes.string,
        valid:  PropTypes.bool
        
    };

    constructor(props) {
        super(props);
        this.state = {
            placeholder: "Enter Url",
            content: '',
            valid: false
        }
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleInputChange(e) {
        const content = e.target.value;
        this.setState(() => {
            return {
                content,
                valid: STlib.urlValidator(content),
            };
        })
        console.log("changed");
    }

    handleSubmit(e) {
        e.preventDefault();
        if (!this.state.valid) {
            return;
        }
        const url = this.state.content;
        this.props.onSubmit(url);
        this.setState(() => ({
            content: '',
            valid: false
        }))
        console.log("submit");

    }

    render() {
        return (
            <form id="urlForm">
                <input id="inputUrlForm" value={this.state.content}
                    placeholder={this.state.placeholder}
                    onChange={this.handleInputChange}
                    onSubmit={this.handleSubmit} /><br />
                <button onClick={this.handleSubmit} id="submitBtn">Send</button>
            </form>
        );
    }



}