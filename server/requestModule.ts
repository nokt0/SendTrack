import IToCompare from "./Interfaces/IToCompare";
import {
    DEEZER_OPTIONS,
    RequestType,
    Services,
    SPOTIFY_OPTIONS,
    SPOTIFY_TOKEN_OPTIONS,
    YOUTUBE_API_KEY,
    YOUTUBE_OPTIONS
} from "./const"
import IncorrectRequest from "./Errors/IncorrectRequest";
import ISpotifyToken from "./Interfaces/Spotify/ISpotifyToken";
import BadResponse from "./Errors/BadResponse";
// @ts-ignore
import fetch from 'node-fetch';
import IYoutubeSearch from "./Interfaces/Youtube/IYoutubeSearch";
import ISpotifySearch from "./Interfaces/Spotify/ISpotifySearch";
import IDeezerItem from "./Interfaces/Deezer/IDeezerItem";
import IDeezerSearch from "./Interfaces/Deezer/IDeezerSearch";
import ISpotifyItem from "./Interfaces/Spotify/ISpotifyItem";
import IResponse from "./Interfaces/IResponse";
import IYoutubeItem from "./Interfaces/Youtube/IYoutubeItem";

let spotifyToken: ISpotifyToken;

export async function fetchYoutube(request: IToCompare, type: RequestType): Promise<IResponse> {
    const answerObject = {} as IResponse;
    const {track, artist, id} = request;
    const isCorrect = (track && artist) || id;

    if (!isCorrect) {
        throw new IncorrectRequest("Not correct", request);
    }

    const youtubeOptions = {...YOUTUBE_OPTIONS};
    let requestUrl = '';
    switch (type) {
        case RequestType.SEARCH_REQUEST:
            requestUrl = '/search?q=' + artist + ' ' + track;
            break;
        case RequestType.TRACK_REQUEST:
            requestUrl = '/videos?id=' + id;
            break;
        default:
            throw new IncorrectRequest("Incorrect request type", request);
    }

    requestUrl += '&part=snippet&key=' + YOUTUBE_API_KEY;
    youtubeOptions.path = encodeURI(requestUrl);

    function setJson(json) {
        answerObject.youtube = json;
        return answerObject;
    }

    await fetch(youtubeOptions.url + requestUrl, youtubeOptions)
        .then((res) => res.json())
        .then((json) => {
            setJson(json);
            console.log(json);
        })
        .catch((e) => {
            const error = e as BadResponse;
            error.service = Services.YOUTUBE;
            throw error;
        });

    return answerObject;
}

export async function fetchTokenSpotify() {
    let token: ISpotifyToken;

    if (spotifyToken) {
        token = spotifyToken;
    } else {
        token = {key: '', date: 0, expires: -1};
    }

    console.log(new Date(token.date).toString());
    console.log(new Date(Date.now() + 3600000).toString());

    if (token.key === '' || Date.now() > token.expires || token.date === 0) {

        function callback(json) {
            if (json) {
                token = {
                    key: json.access_token,
                    date: Date.now(),
                    expires: Date.now() + 3600000,
                };
                console.log(token.date.toString());
            } else {
                console.log(json);
            }
            console.log(token);
        }

        function error() {
            token = undefined;
        }

        await fetch(SPOTIFY_TOKEN_OPTIONS.url
            , SPOTIFY_TOKEN_OPTIONS)
            .then((res) => res.json())
            .then((json) => callback(json))
            .catch((e) => {
                const errr = e as BadResponse;
                errr.service = Services.SPOTIFY;
                throw errr;
            });

        spotifyToken = token;
        return spotifyToken;
    } else {
        return token;
    }
}

export async function fetchSpotify(request: IToCompare, type: RequestType): Promise<IResponse> {
    const answerObject = {} as IResponse;
    const {track, artist, id} = request;
    const isCorrect = (track && artist) || id;

    if (!isCorrect) {
        throw new IncorrectRequest("Not Correct", request);
    }

    const options = {
        ...SPOTIFY_OPTIONS,
        headers: {
            'Authorization': 'Bearer ',
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
    };

    function setOptions(token) {
        options.headers.Authorization = 'Bearer ' + token;
        return true;
    }

    for (let i = 0; i < 5; i++) {
        await fetchTokenSpotify().then((token) => {
            if (token && token.key) {
                setOptions(token.key);
            }
        });
        if (options.headers.Authorization !== 'Bearer ') {
            break;
        }
    }

    let requestUrl = '';
    switch (type) {
        case RequestType.SEARCH_REQUEST:
            requestUrl = '/search?q=' + artist + ' ' + track + '&type=track';
            break;
        case RequestType.TRACK_REQUEST:
            requestUrl = '/tracks/' + id;
            break;
        default:
            throw new IncorrectRequest("Incorrect request type", request);
    }

    function setJson(json) {
        answerObject.spotify = json;
        return answerObject;
    }

    options.url += encodeURI(requestUrl);

    await fetch(options.url, options)
        .then((res) => res.json())
        .then((json) => setJson(json))
        .catch((e) => {
            const error = e as BadResponse;
            error.service = Services.SPOTIFY;
            throw error;
        });

    return answerObject;
}

export async function fetchDeezer(request: IToCompare, type: RequestType): Promise<IResponse> {
    const answerObject = {} as IResponse;
    const {track, artist, id} = request;
    const isCorrect = (track && artist) || id;

    if (!isCorrect) {
        throw new IncorrectRequest("Not correct", request);
    }

    const options = {...DEEZER_OPTIONS};
    let requestUrl = options.url;
    switch (type) {
        case RequestType.SEARCH_REQUEST:
            requestUrl += '/search?q=artist:"' + artist + '" track:"' + track + '"';
            break;
        case RequestType.TRACK_REQUEST:
            requestUrl += '/track/' + id;
            break;
        default:
            throw new IncorrectRequest("Incorrect request type", request);
    }

    function setJson(json) {
        answerObject.deezer = json;
        return answerObject;
    }

    await fetch(requestUrl, options)
        .then((res) => res.json())
        .then((json) => setJson(json))
        .catch((e) => {
            const error = e as BadResponse;
            error.service = Services.DEEZER;
            throw error;
        });

    return answerObject;
}
