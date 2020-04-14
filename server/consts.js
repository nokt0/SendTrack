const freeze = require('deep-freeze-node');
require('dotenv').config();



const BASE64_KEY = process.env.BASE64_KEY;
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const API_DEEZER_URL = 'https://api.deezer.com/';
const SEARCH_REQUEST = 'SEARCH_REQUEST';
const TRACK_REQUEST = 'TRACK_REQUEST';
const DEEZER = 'DEEZER';
const YOUTUBE = 'YOUTUBE';
const SPOTIFY = 'SPOTIFY';

exports.SEARCH_REQUEST = SEARCH_REQUEST;
exports.TRACK_REQUEST = TRACK_REQUEST;
exports.API_DEEZER_URL = API_DEEZER_URL;
exports.BASE64_KEY = BASE64_KEY;
exports.YOUTUBE_API_KEY = YOUTUBE_API_KEY;
exports.YOUTUBE = YOUTUBE;
exports.SPOTIFY = SPOTIFY;
exports.DEEZER = DEEZER;

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
    'Authorization': 'Basic ' + BASE64_KEY,
    'content-type': 'application/x-www-form-urlencoded',
  },
});
