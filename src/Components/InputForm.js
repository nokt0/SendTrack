import React, { Component } from 'react';
import PropTypes from 'prop-types';

import '../scss/InputForm.scss';
import searchLogo from '../SVG/search-solid.svg';
import {urlValidator} from '../SendTrack_lib.js';

export default class InputForm extends Component {

    static propTypes = {
        content: PropTypes.string,
        isUrl:  PropTypes.bool
        
    };

    constructor(props) {
        super(props);
        this.state = {
            placeholder: "Enter: Url / artist - name",
            content: '',
            isUrl: false,
        }
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleInputChange(e) {
        const content = e.target.value;
        this.setState(() => {
            return {
                content,
                isUrl: urlValidator(content),
            };
        })
    }

    handleSubmit(e) {
        e.preventDefault();
        const input = this.state.content;
        if (!this.state.isUrl) {
            this.setState(() => ({
                content: '',
                isUrl: false,
            }));
        }
        
        this.props.onSubmit(input, this.state.isUrl);
        this.setState(() => ({
            content: '',
            isUrl: false,
        }))
        console.log("submit");

    }

    render() {
        return (
            <div className='input-form container'>
            <form className='input-form__text-form'>
                <input value={this.state.content}
                    placeholder={this.state.placeholder}
                    onChange={this.handleInputChange}
                    onSubmit={this.handleSubmit} />
                <button onClick={this.handleSubmit}><img src={searchLogo} alt=""/></button>
            </form>
            </div>
        );
    }



}