"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const cnst_1 = require("./cnst");
const IncorrectRequest_1 = require("./Errors/IncorrectRequest");
// @ts-ignore
const node_fetch_1 = require("node-fetch");
let spotifyToken;
function fetchYoutube(request, type) {
    return __awaiter(this, void 0, void 0, function* () {
        const answerObject = {};
        const { track, artist, id } = request;
        const isCorrect = (track && artist) || id;
        if (!isCorrect) {
            throw new IncorrectRequest_1.default("Not correct", request);
        }
        const youtubeOptions = Object.assign({}, cnst_1.YOUTUBE_OPTIONS);
        let requestUrl = '';
        switch (type) {
            case cnst_1.RequestType.SEARCH_REQUEST:
                requestUrl = '/search?q=' + artist + ' ' + track;
                break;
            case cnst_1.RequestType.TRACK_REQUEST:
                requestUrl = '/videos?id=' + id;
                break;
            default:
                throw new IncorrectRequest_1.default("Incorrect request type", request);
        }
        requestUrl += '&part=snippet&key=' + cnst_1.YOUTUBE_API_KEY;
        youtubeOptions.path = encodeURI(requestUrl);
        function setJson(json) {
            answerObject.youtube = json;
            return answerObject;
        }
        yield node_fetch_1.default(youtubeOptions.url + requestUrl, youtubeOptions)
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
    });
}
exports.fetchYoutube = fetchYoutube;
function fetchTokenSpotify() {
    return __awaiter(this, void 0, void 0, function* () {
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
            yield node_fetch_1.default(cnst_1.SPOTIFY_TOKEN_OPTIONS.url, cnst_1.SPOTIFY_TOKEN_OPTIONS)
                .then((res) => res.json())
                .then((json) => callback(json))
                .catch((e) => {
                const errr = e;
                errr.service = cnst_1.Services.SPOTIFY;
                throw errr;
            });
            spotifyToken = token;
            return spotifyToken;
        }
        else {
            return token;
        }
    });
}
exports.fetchTokenSpotify = fetchTokenSpotify;
function fetchSpotify(request, type) {
    return __awaiter(this, void 0, void 0, function* () {
        const answerObject = {};
        const { track, artist, id } = request;
        const isCorrect = (track && artist) || id;
        if (!isCorrect) {
            throw new IncorrectRequest_1.default("Not Correct", request);
        }
        const options = Object.assign(Object.assign({}, cnst_1.SPOTIFY_OPTIONS), { headers: {
                'Authorization': 'Bearer ',
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            } });
        function setOptions(token) {
            options.headers.Authorization = 'Bearer ' + token;
            return true;
        }
        for (let i = 0; i < 5; i++) {
            yield fetchTokenSpotify().then((token) => {
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
                throw new IncorrectRequest_1.default("Incorrect request type", request);
        }
        function setJson(json) {
            answerObject.spotify = json;
            return answerObject;
        }
        options.url += requestUrl;
        yield node_fetch_1.default(options.url, options)
            .then((res) => res.json())
            .then((json) => setJson(json))
            .catch((e) => {
            const error = e;
            error.service = cnst_1.Services.SPOTIFY;
            throw error;
        });
        return answerObject;
    });
}
exports.fetchSpotify = fetchSpotify;
function fetchDeezer(request, type) {
    return __awaiter(this, void 0, void 0, function* () {
        const answerObject = {};
        const { track, artist, id } = request;
        const isCorrect = (track && artist) || id;
        if (!isCorrect) {
            throw new IncorrectRequest_1.default("Not correct", request);
        }
        const options = Object.assign({}, cnst_1.DEEZER_OPTIONS);
        let requestUrl = options.url;
        switch (type) {
            case cnst_1.RequestType.SEARCH_REQUEST:
                requestUrl += '/search?q=artist:"' + artist + '" track:"' + track + '"';
                break;
            case cnst_1.RequestType.TRACK_REQUEST:
                requestUrl += '/track/' + id;
                break;
            default:
                throw new IncorrectRequest_1.default("Incorrect request type", request);
        }
        function setJson(json) {
            answerObject.deezer = json;
            return answerObject;
        }
        yield node_fetch_1.default(requestUrl, options)
            .then((res) => res.json())
            .then((json) => setJson(json))
            .catch((e) => {
            const error = e;
            error.service = cnst_1.Services.DEEZER;
            throw error;
        });
        return answerObject;
    });
}
exports.fetchDeezer = fetchDeezer;
//# sourceMappingURL=requestModules.js.map