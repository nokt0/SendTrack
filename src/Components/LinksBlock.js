import React, { Component } from 'react';
import Link from './Link';
import '../Styles/LinksBlock.css'


export default class LinksBlock extends Component {
    constructor(props) {
        super(props);
        this.getInfo = this.getInfo.bind(this);
        this.getLinks = this.getLinks.bind(this);
        
    }

    getInfo() {
        return (<div className='input-object'>
            {this.props.artist}<br />
            {this.props.track}<br />
            {this.props.url}<br />
        </div>)
    }

    getLinks() {
        let arrayOfUrls = [];
        function createLinkJSX(item){
            return(
                <Link service={service} artist={item.artist} track={item.track}
                    url={item.url} albumArt={item.albumArt} />
            );
        }
        for (var service in this.props.arrayOfUrls) {
            if (this.props.arrayOfUrls[service] === 'Not Found')
                continue;
            var obj = this.props.arrayOfUrls[service];
            arrayOfUrls.push(createLinkJSX(obj));
        }
        
        console.log(arrayOfUrls);
        return arrayOfUrls;
    }



    render() {
        return (
            <div className="LinksBlock">
                <this.getInfo />
                <this.getLinks />
                {/* <Link service='spotify' artist={this.props.arrayOfUrls.spotify.artist}
                    track={this.props.arrayOfUrls.spotify.track}
                    url={this.props.arrayOfUrls.spotify.url}
                    artwork={this.props.arrayOfUrls.spotify.artwork}
                />
                <Link service='youtube' artist={this.props.arrayOfUrls.spotify.artist}
                    track={this.props.arrayOfUrls.spotify.track}
                    url={this.props.arrayOfUrls.spotify.url}
                    artwork={this.props.arrayOfUrls.spotify.artwork}
                /> */}

            </div>
        )
    }
}