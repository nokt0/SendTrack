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

export function tracksHasErrored(bool, e) {
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

export function setInputInfo(artist, track, err) {

  return {
    type: C.SET_ARTIST_TRACK_INFO,
    artist: artist?.trim() ?? '',
    track: track?.trim() ?? '',
    err: err?.trim() ?? '',
  };
}

export function setBackground(fetchResponse) {
  let background;
  for (let [service, data] of Object.entries(fetchResponse).reverse()) {
    if (data?.bigAlbumArt) {
      background = data.bigAlbumArt;
      if (service !== 'youtube' && service !== 'youtubeMusic') {
        break;
      }
    }
  }
  return {
    type: C.SET_BACKGROUND,
    background,
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
        return response;
      })
      .then((response) => response.json())
      .then((tracks) => {
        dispatch(tracksFetchSuccess(tracks));
        return tracks;
      })
      .then((tracks) => dispatch(setBackground(tracks)))
      .then(()=>dispatch(setInputInfo(url)))
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
      .then((response) => {
        return response.json();
      })
      .then((tracks) => {
        dispatch(tracksFetchSuccess(tracks));
        return tracks;
      })
      .then((tracks) => dispatch(setBackground(tracks)))
      .then(() => dispatch(setInputInfo(artist,track)))
      .catch((e) => {
        dispatch(tracksHasErrored(true));
      });
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


