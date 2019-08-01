import React, { Component } from 'react';
import '../scss/Link.scss'

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

    render() {
        return (
            <div className="link container">
                    <a href={this.props.url} className="link__element container"
                    target="_blank" rel="noopener noreferrer">
                        <img src={this.props.albumArt} className="link__album-art" alt="" />
                        <div className="link__artist-track container">
                            <div className="link__track-name">{this.props.track}</div>
                            <div className="link__artist-name">{this.props.artist}</div>
                        </div>
                        <img src={this.props.service} className="link__service-name" alt=""/> 
                    </a>
                
            </div>)
    }
}