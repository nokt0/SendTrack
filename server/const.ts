const freeze = require('deep-freeze-node');
require('dotenv').config();

export enum Services {
    DEEZER = "DEEZER",
    YOUTUBE = "YOUTUBE",
    SPOTIFY = "SPOTIFY"
}

export enum RequestType {
    SEARCH_REQUEST = 'SEARCH_REQUEST',
    TRACK_REQUEST = 'TRACK_REQUEST'
}

export const BASE64_KEY = process.env.BASE64_KEY;
export const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
export const API_DEEZER_URL = 'https://api.deezer.com/';


export const RESPONSE_JSON = freeze({
    youtube: '',
    youtubeMusic: '',
    spotify: '',
    deezer: '',
});

export const YOUTUBE_OPTIONS = freeze({
    url: 'https://www.googleapis.com/youtube/v3',
    headers: {
        'Content-Type': 'application/json',
    },
    method: 'GET',
});

export const DEEZER_OPTIONS = freeze({
    url: 'https://api.deezer.com',
    headers: {
        'content-type': 'application/json',
    },
});

export const SPOTIFY_OPTIONS = freeze({
    url: 'https://api.spotify.com/v1',
    headers: {
        'Accept': 'application/json',
        'Authorization': 'Bearer ',
        'Content-Type': 'application/json',
    },
});

export const SPOTIFY_TOKEN_OPTIONS = freeze({
    url: 'https://accounts.spotify.com/api/token',
    method: 'POST',
    body: 'grant_type=client_credentials',
    headers: {
        'Authorization': 'Basic ' + BASE64_KEY,
        'content-type': 'application/x-www-form-urlencoded',
    },
});
