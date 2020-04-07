import C from '../constants.js';
import {
  getServiceId,
  createByIdRequest,
  createArtistTrackRequestUrl,
  isUrl,
  artistTrackFromString,
} from './helpers/urlWorker';

export function inputHasErrored(bool) {
  return {
    type: C.INPUT_ERROR,
    isInputErrored: bool,
  };
}

export function tracksHasErrored(bool) {
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

export function tracksFetchSuccess(tracks, submitType) {
  return {
    type: C.SUBMIT_FORM,
    submitType,
    ...tracks,
  };
}

export function fetchTracksByUrl(url) {
  return (dispatch) => {
    dispatch(tracksIsFetching(true));
    const {service, id} = getServiceId(url);
    const requestUrl = createByIdRequest(id, service);

    fetch(requestUrl)
        .then((response)=>{
          if (!response.ok) {
            throw new Error(response.statusText);
          }
          dispatch(tracksIsFetching(false));
          return response;
        })
        .then((response) => response.json())
        .then((tracks) =>
          dispatch(tracksFetchSuccess(tracks, C.submitType.BY_URL)))
        .catch(() => dispatch(itemsHasErrored(true)));
  };
}

export function fetchTracksByArtistTrack(artist, track) {
  return (dispatch) => {
    dispatch(tracksIsFetching(true));
    const requestUrl = createArtistTrackRequestUrl(artist, track);

    fetch(requestUrl)
        .then((response)=>{
          if (!response.ok) {
            throw new Error(response.statusText);
          }
          dispatch(tracksIsFetching(false));
          return response;
        })
        .then((response) => response.json())
        .then((tracks) => dispatch(tracksFetchSuccess(tracks, C.submitType.BY_ARTIST_TRACK)))
        .catch(() => dispatch(itemsHasErrored(true)));
  };
}

export function submitForm(input) {
  if (isUrl(input)) {
    return fetchTracksByUrl(input);
  }
  const {artist, track} = artistTrackFromString(input);
  if (artist && track) {
    return fetchTracksByArtistTrack(artist, track);
  }
  return inputHasErrored(true);
}
