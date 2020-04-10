import {
  requestData,
  submitFormByUrl,
  submitFormByArtistTrack,
} from './actions.js';
import {
  creatByIdRequest,
  createArtistTrackRequestUrl,
} from './helpers/urlWorker';
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

