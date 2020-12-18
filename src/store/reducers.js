import bckg from '../img/black-bkg.webp';
import C from '../constants.js';

export function fetchSuccess(state = {}, action) {
  switch (action.type) {
    case C.FETCH_SUCCESS:
      return action.tracks;
    default:
      return state;
  }
}

export function tracksHasErrored(state = false, action) {
  switch (action.type) {
    case C.FETCH_ERROR:
      return action.isTrackErrored;
    default:
      return state;
  }
}

export function tracksIsFetching(state = false, action) {
  switch (action.type) {
    case C.IS_FETCHING:
      return action.isFetching;

    default:
      return state;
  }
}

export function submitType(state = '', action) {
  switch (action.type) {
    case C.SUBMIT_TYPE:
      return action.submitType;
    default:
      return state;
  }
}

export function background(state = bckg, action) {
  switch (action.type) {
    case C.SET_BACKGROUND:
      return action.background;
    default:
      return state;
  }
}

export function inputInfo(state = {}, action) {
  switch (action.type) {
    case C.SET_ARTIST_TRACK_INFO:
      return {
        artist: action.artist,
        track: action.track,
        error: action.error,
      };
    default:
      return state;
  }
}

