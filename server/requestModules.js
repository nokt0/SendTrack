"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cnst_1 = require("./cnst");
const IncorrectRequest_1 = require("./Errors/IncorrectRequest");
// @ts-ignore
const node_fetch_1 = require("node-fetch");
async function fetchYoutube(request, type) {
    const answerObject = { youtube: '' };
    const { track, artist, id } = request;
    const isCorrect = (track && artist) || id;
    if (!isCorrect) {
        throw new IncorrectRequest_1.default("Not correct", request);
    }
    const youtubeOptions = { ...cnst_1.YOUTUBE_OPTIONS };
    let requestUrl = '';
    switch (type) {
        case cnst_1.RequestType.SEARCH_REQUEST:
            requestUrl = '/search?q=' + artist + ' ' + track;
            break;
        case cnst_1.RequestType.TRACK_REQUEST:
            requestUrl = '/videos?id=' + id;
            break;
        default:
            return answerObject;
    }
    requestUrl += '&part=snippet&key=' + cnst_1.YOUTUBE_API_KEY;
    youtubeOptions.path = encodeURI(requestUrl);
    function setJson(json) {
        answerObject.youtube = json;
    }
    await node_fetch_1.default(youtubeOptions.url + requestUrl, youtubeOptions)
        .then((res) => res.json())
        .then((json) => {
        setJson(json);
        console.log(json);
    })
        .catch((e) => {
        const error = e;
        error.service = cnst_1.Services.YOUTUBE;
        throw error;
    });
    return answerObject;
}
exports.fetchYoutube = fetchYoutube;
let spotifyToken;
async function tokenSpotify() {
    let token;
    if (spotifyToken) {
        token = spotifyToken;
    }
    else {
        token = { key: '', date: 0, expires: -1 };
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
            }
            else {
                console.log(json);
            }
            console.log(token);
        }
        function error() {
            token = undefined;
        }
        await node_fetch_1.default(cnst_1.SPOTIFY_TOKEN_OPTIONS.url, cnst_1.SPOTIFY_TOKEN_OPTIONS)
            .then((res) => res.json())
            .then((json) => callback(json))
            .catch((e) => {
            let error = e;
            error.service = cnst_1.Services.SPOTIFY;
            throw error;
        });
        spotifyToken = token;
        return spotifyToken;
    }
    else {
        return token;
    }
}
exports.tokenSpotify = tokenSpotify;
async function fetchSpotify(request, type) {
    const answerObject = { spotify: '' };
    const { track, artist, id } = request;
    const isCorrect = (track && artist) || id;
    if (!isCorrect) {
        return answerObject;
    }
    const options = {
        ...cnst_1.SPOTIFY_OPTIONS,
        headers: {
            'Authorization': 'Bearer ',
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
    };
    function setOptions(token) {
        options.headers.Authorization = 'Bearer ' + token;
    }
    for (let i = 0; i < 5; i++) {
        await tokenSpotify().then((token) => {
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
        case cnst_1.RequestType.SEARCH_REQUEST:
            requestUrl = '/search?q=' + artist + ' ' + track + '&type=track';
            break;
        case cnst_1.RequestType.TRACK_REQUEST:
            requestUrl = '/tracks/' + id;
            break;
        default:
            return answerObject;
    }
    function setJson(json) {
        answerObject.spotify = json;
    }
    options.url += requestUrl;
    await node_fetch_1.default(options.url, options)
        .then((res) => res.json())
        .then((json) => setJson(json))
        .catch((e) => {
        const error = e;
        error.service = cnst_1.Services.SPOTIFY;
        throw error;
    });
    return answerObject;
}
exports.fetchSpotify = fetchSpotify;
async function fetchDeezer(request, type) {
    const answerObject = { deezer: '' };
    const { track, artist, id } = request;
    const isCorrect = (track && artist) || id;
    if (!isCorrect) {
        return answerObject;
    }
    const options = { ...cnst_1.DEEZER_OPTIONS };
    let requestUrl = options.url;
    switch (type) {
        case cnst_1.RequestType.SEARCH_REQUEST:
            requestUrl += '/search?q=artist:"' + artist + '" track:"' + track + '"';
            break;
        case cnst_1.RequestType.TRACK_REQUEST:
            requestUrl += '/track/' + id;
            break;
        default:
            return answerObject;
    }
    function setJson(json) {
        answerObject.deezer = json;
        return answerObject.deezer;
    }
    await node_fetch_1.default(requestUrl, options)
        .then((res) => res.json())
        .then((json) => setJson(json))
        .catch((e) => {
        const error = e;
        error.service = cnst_1.Services.DEEZER;
        throw error;
    });
    return answerObject;
}
exports.fetchDeezer = fetchDeezer;
//# sourceMappingURL=requestModules.js.map