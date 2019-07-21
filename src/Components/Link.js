import React, { Component } from 'react';
import '../Styles/Link.css'

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
        <div className="link-to-track"><a href={this.props.url} >
        <div className="service-name">{this.props.service}</div>
        <img src={this.props.albumArt}/>
        <div className="artist-name">{this.props.artist}</div>
        <div className="track-name">{this.props.track}</div>
        </a></div>)
    }
}