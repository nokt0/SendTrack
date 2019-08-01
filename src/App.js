import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './scss/App.scss';
import background from './img/image-from-rawpixel-id-558785-jpeg.jpg';
import crystall from './img/image-from-rawpixel-id-558806-jpeg.jpg';
import InputForm from './Components/InputForm';
import { urlWorker } from '../src/SendTrack_lib.js';
import { createArrayOfUrls } from '../src/SendTrack_lib.js';
import { searchByWord } from '../src/SendTrack_lib.js';
import LinksBlock from './Components/LinksBlock';


class App extends Component {

  static propTypes = {
    url: PropTypes.string,

  };

  constructor(props) {
    super(props);
    this.initialState = {
      artist: '',
      track: '',
      url: '',
      background: background,
      arrayOfUrls: {
        spotify: 'Not Found',
        youtube: 'Not Found',
        youtubeMusic: 'Not Found'
      }
    }
    this.state = this.initialState
    this.getLink = this.getLink.bind(this);
  }


  getLink(input, isUrl) {
    var objToCompare;
    var albumArt = background;
    if (isUrl)
      objToCompare = urlWorker(input);
    else
      objToCompare = searchByWord(input);

    var arrayOfUrls = createArrayOfUrls(objToCompare);
    if (arrayOfUrls.spotify !== "Not Found")
        albumArt = arrayOfUrls.spotify.albumArt;
    else
      if(arrayOfUrls.youtubeMusic !== "Not Found")
        albumArt = arrayOfUrls.youtubeMusic.albumArt;

      this.setState(() => ({
        artist: objToCompare.artist,
        track: objToCompare.track,
        url: objToCompare.url,
        arrayOfUrls: arrayOfUrls,
        background: albumArt
      }));




  }

  render() {
    return (
      <div className="App">
       {/*  <img className="crystall" src={crystall} alt=""/> */}
        <img className="bg" src={this.state.background} alt="" />
        <InputForm onSubmit={this.getLink} />
        <LinksBlock arrayOfUrls={this.state.arrayOfUrls} artist={this.state.artist} track={this.state.track} url={this.state.url} />
        <div id="result"></div>
      </div>
    );
  }
}


export default App;
