import React, { Component } from 'react';

export default class LinksBlock extends Component {
/*     constructor(props){
        super(props);
        this.state = { 
            albumArt: '',
            artist:'',
            track:'',
            url:'',
            service: ''
        }
    } */

    render(){
        return(
        <a href={this.props.url} className="link-to-track">
        <img src={this.props.albumArt}/>
        <div className="artist-name">{this.props.artist}</div>
        <div className="track-name">{this.props.track}</div>
        </a>)
    }
}