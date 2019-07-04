import React, { Component } from 'react';

export default class LinksBlock extends Component {
    constructor(props){
        super(props);
        this.state = { 
            albumArt: '',
            artist:'',
            track:'',
            url:''
        }
    }

    render(){
        return(
        <a href={this.state.link} className="link-to-track">
        <img src={this.state.albumArt}/>
        <div className="artist-name"></div>
        <div className="track-name"></div>
        </a>)
    }
}