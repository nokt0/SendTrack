import React, {Component} from 'react';
import Link from './Link';
import '../../scss/LinksBlock.scss';
import youtubeIcon from '../../svg/youtube-icon.svg';
import spotifyIcon from '../../svg/spotify-icon.svg';
import youtubeMusicIcon from '../../svg/youtube-music-icon.svg';
import deezerIcon from '../../svg/deezer-icon.svg';

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
    </div>);
  }

  getLinks() {
    const arrayOfUrls = [];
    function createLinkJSX(item) {
      return (
        <Link service={item.service} artist={item.artist} track={item.track}
          url={item.url} albumArt={item.albumArt} />
      );
    }
    for (const service in this.props.arrayOfUrls) {
      if (this.props.arrayOfUrls[service] === 'Not Found') {
        continue;
      }
      const obj = this.props.arrayOfUrls[service];
      switch (service) {
        case 'spotify':
          obj.service = spotifyIcon;
          break;
        case 'youtube':
          obj.service = youtubeIcon;
          break;
        case 'youtubeMusic':
          obj.service = youtubeMusicIcon;
          break;
        case 'deezer':
          obj.service = deezerIcon;
          break;
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
        {/* <Link service='spotify' artist='linkin park'
                    track='numb'
                    url=''
                    albumArt='https://i.scdn.co/image/c03090e1f4b09d79fd41855023460c02e13993a8'
                />
                <Link service='youtube' artist='linkin park'
                    track='numb offical video - numb offical video - numb offical video'
                    url=''
                    albumArt='https://i.ytimg.com/vi/kXYiU_JCYtU/hqdefault.jpg'
                />
                <Link service='youtubeMusic' artist='linkin park'
                    track='numb offical video - numb offical video - numb offical video'
                    url=''
                    albumArt='https://i.ytimg.com/vi/kXYiU_JCYtU/hqdefault.jpg'
                />
                <Link service='deezer' artist='linkin park'
                    track='numb'
                    url=''
                    albumArt='https://e-cdns-images.dzcdn.net/images/cover/44df4f6fb2534768f4924365c103d0f7/1000x1000-000000-80-0-0.jpg'
                /> */}

      </div>
    );
  }
}
