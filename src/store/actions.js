import C from '../constants.js';
import fetch from 'node-fetch';

import {
  getServiceId,
  createByIdRequest,
  createArtistTrackRequestUrl,
  isUrl,
  artistTrackFromString,
} from './helpers/urlWorker';

export function submitType(type) {
  return {
    type: C.SUBMIT_TYPE,
    submitType: type,
  };
}

export function inputHasErrored(bool) {
  return {
    type: C.INPUT_ERROR,
    isInputErrored: bool,
  };
}

export function tracksHasErrored(bool,e) {
  return {
    type: C.FETCH_ERROR,
    isTrackErrored: bool,
  };
}

export function tracksIsFetching(bool) {
  return {
    type: C.IS_FETCHING,
    isFetching: bool,
  };
}

export function tracksFetchSuccess(tracks) {
  return {
    type: C.FETCH_SUCCESS,
    tracks,
  };
}

export function fetchTracksByUrl(url) {
  return (dispatch) => {
    dispatch(tracksIsFetching(true));
    const {service, id} = getServiceId(url);
    const prefix = 'http:\/\/localhost:8080';
    const requestUrl = prefix + createByIdRequest(id, service);
    dispatch(submitType(C.submitTypes.BY_URL));

    const f = fetch(requestUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        dispatch(tracksIsFetching(false));
        console.log(response);
        return response;
      })
      .then((response) => response.json())
      .then((tracks) =>{
        console.log(tracks);
        dispatch(tracksFetchSuccess(tracks))})
      .catch(() => dispatch(tracksHasErrored(true)));
  };
}

export function fetchTracksByArtistTrack(artist, track) {
  return (dispatch) => {
    dispatch(tracksIsFetching(true));
    const prefix = 'http:\/\/localhost:8080';
    const requestUrl = prefix + createArtistTrackRequestUrl(artist, track);
    dispatch(submitType(C.submitTypes.BY_ARTIST_TRACK));

    fetch(requestUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        dispatch(tracksIsFetching(false));
        return response;
      })
      .then((response) => { return response.json();})
      .then((tracks) => {dispatch(tracksFetchSuccess(tracks));  })
      .catch((e) => {dispatch(tracksHasErrored(true)); console.log(e);});
  };
}

export function submitForm(input) {
  if (isUrl(input)) {
    return fetchTracksByUrl(input);
  } else {
    const {artist, track} = artistTrackFromString(input);
    if (artist && track) {
      return fetchTracksByArtistTrack(artist, track);
    }
  }

  return inputHasErrored(true);
}
