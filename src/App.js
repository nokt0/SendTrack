import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './scss/App.scss';
import { urlWorker, createArrayOfUrls, searchByWord, getLog } from './store/helpers/SendTrack_lib.js';
import InputFormContainer from './Components/Containers/InputFormContainer';
import LinkBlockContainer from './Components/Containers/LinkBlockContainer';

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
        spotify: 'Not Found',
        deezer: 'Not Found',
        youtube: 'Not Found',
        youtubeMusic: 'Not Found'
      },
    };
    this.state = this.initialState;
  }

  render() {
    return (
      <div className="App">
        <img className="bg" src={this.props.background} alt="" />
        <InputFormContainer/>
        <LinkBlockContainer artist={this.state.artist} track={this.state.track} url={this.state.url} />
        <div id="result"></div>
      </div>
    );
  }
}


export default App;
