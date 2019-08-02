import React, { Component } from 'react';
import Link from './Link';
import '../scss/LinksBlock.scss';
import youtube_icon from '../SVG/youtube-icon.svg';
import spotify_icon from '../SVG/spotify-icon.svg';
import youtubeMusic_icon from '../SVG/youtube-music-icon.svg';
import deezer_icon from '../SVG/deezer-icon.svg'

export default class LinksBlock extends Component {
    constructor(props) {
        super(props);
        this.getInfo = this.getInfo.bind(this);
        this.getLinks = this.getLinks.bind(this);

    }

    getInfo() {
        return (<div className='links-block__input-object'>
            {this.props.artist}<br />
            {this.props.track}<br />
            {this.props.url}<br />
        </div>)
    }

    getLinks() {
        let arrayOfUrls = [];
        function createLinkJSX(item) {
            return (
                <Link service={item.service} artist={item.artist} track={item.track}
                    url={item.url} albumArt={item.albumArt} />
            );
        }
        for (var service in this.props.arrayOfUrls) {
            if (this.props.arrayOfUrls[service] === 'Not Found')
                continue;
            var obj = this.props.arrayOfUrls[service];
            switch(service){
                case 'spotify':
                    obj.service = spotify_icon;
                    break;
                case 'youtube':
                    obj.service = youtube_icon;
                    break;
                case 'youtubeMusic':
                    obj.service = youtubeMusic_icon;
                    break;
                case 'deezer':
                    obj.service = deezer_icon;
                default:
                    break;
                }
            arrayOfUrls.push(createLinkJSX(obj));
        }

        console.log(arrayOfUrls);
        return arrayOfUrls;
    }



    render() {
        return (
            <div className="links-block container">
                <this.getInfo />
                <this.getLinks />


            </div>
        )
    }
}