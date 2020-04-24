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

  render() {
    return (
      <div className="App">
        <img className="bg" src={this.props.background} alt="" />
        <InputFormContainer/>
        <LinkBlockContainer artist={this.props.inputInfo.artist} track={this.props.inputInfo.track} url={this.props.inputInfo.error} />
      </div>
    );
  }
}


export default App;
