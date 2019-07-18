import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './Styles/App.css';
import InputForm from './Components/InputForm';
import { urlWorker } from '../src/SendTrack_lib.js';
import { createArrayOfUrls } from '../src/SendTrack_lib.js';
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
      arrayOfUrls: {
        spotify: {},
        youtube: {},
        youtubeMusic: {}
      }
    }
    this.state = this.initialState
    this.getLink = this.getLink.bind(this);
  }


  getLink(url) {
    const objToCompare = urlWorker(url);
    this.setState(() => ({
      artist: objToCompare.artist,
      track: objToCompare.track,
      url: objToCompare.url
    }));
    var arrayOfUrls = createArrayOfUrls(objToCompare);
    this.setState(() => ({
      arrayOfUrls: arrayOfUrls
    }))




  }

  render() {
    return (
      <div className="App">
        <InputForm onSubmit={this.getLink} />
        <LinksBlock arrayOfUrls={this.state.arrayOfUrls} artist={this.state.artist} track={this.state.track} url={this.state.url} />
        <div id="result"></div>
      </div>
    );
  }
}


export default App;
