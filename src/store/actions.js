import C from "../constants.js";

export function requestData(argumentsObj, requestType) {
    return{
        type : C.REQUEST_DATA,
        requestType : requestType,
        argumentsObj : argumentsObj
    }
};

export function submitFormByUrl(url) {
    return{
        type : C.SUBMIT_FORM,
        submitBy : C.submitType.BY_URL,
        url : url,
        artist : undefined,
        track : undefined
    }
}

export function submitFormByArtistTrack(artist,track) {
    return{
        type : C.SUBMIT_FORM,
        submitBy : C.submitType.BY_ARTIST_TRACK,
        url : undefined,
        artist : artist,
        track : track
    }
}