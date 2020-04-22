"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const freeze = require('deep-freeze-node');
require('dotenv').config();
var Services;
(function (Services) {
    Services["DEEZER"] = "DEEZER";
    Services["YOUTUBE"] = "YOUTUBE";
    Services["SPOTIFY"] = "SPOTIFY";
})(Services = exports.Services || (exports.Services = {}));
var RequestType;
(function (RequestType) {
    RequestType["SEARCH_REQUEST"] = "SEARCH_REQUEST";
    RequestType["TRACK_REQUEST"] = "TRACK_REQUEST";
})(RequestType = exports.RequestType || (exports.RequestType = {}));
exports.BASE64_KEY = process.env.BASE64_KEY;
exports.YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
exports.API_DEEZER_URL = 'https://api.deezer.com/';
exports.RESPONSE_JSON = freeze({
    youtube: '',
    youtubeMusic: '',
    spotify: '',
    deezer: '',
});
exports.YOUTUBE_OPTIONS = freeze({
    url: 'https://www.googleapis.com/youtube/v3',
    headers: {
        'Content-Type': 'application/json',
    },
    method: 'GET',
});
exports.DEEZER_OPTIONS = freeze({
    url: 'https://api.deezer.com',
    headers: {
        'content-type': 'application/json',
    },
});
exports.SPOTIFY_OPTIONS = freeze({
    url: 'https://api.spotify.com/v1',
    headers: {
        'Accept': 'application/json',
        'Authorization': 'Bearer ',
        'Content-Type': 'application/json',
    },
});
exports.SPOTIFY_TOKEN_OPTIONS = freeze({
    url: 'https://accounts.spotify.com/api/token',
    method: 'POST',
    body: 'grant_type=client_credentials',
    headers: {
        'Authorization': 'Basic ' + exports.BASE64_KEY,
        'content-type': 'application/x-www-form-urlencoded',
    },
});
//# sourceMappingURL=const.js.map