import {requestData, submitFormByUrl,submitFormByArtistTrack} from "./actions.js";
import C from "../constants.js";

function doSubmitForm(state, action) {
    if(action.type !== C.SUBMIT_FORM){
        return state;
    }
    switch (action.submitBy) {
        case "BY_URL":
            return {
                ...state,
                url: action.url,
                artist : undefined,
                track : undefined
            };
        case "BY_ARTIST_TRACK":
            return {
                ...state,
                url: undefined,
                artist : action.artist,
                track : action.track
            };
        default:
            return state;
    }
}
