const C = require('./consts');
const fetch = require('node-fetch');
let spotifyToken;
/**
 *
 * @param {*} request
 * @param {*} type
 */
async function youtube(request, type) {
  const answerObject = {youtube: ''};
  const {track, artist, id} = request;
  const isCorrect = (track && artist) || id;

  if (!isCorrect) {
    return answerObject;
  }

  const youtubeOptions = {...C.YOUTUBE_OPTIONS};
  let requestUrl = '';
  switch (type) {
    case C.SEARCH_REQUEST:
      requestUrl = '/search?q=' + artist + ' ' + track;
      break;
    case C.TRACK_REQUEST:
      requestUrl = '/videos?id=' + id;
      break;
    default:
      return answerObject;
  }

  requestUrl += '&part=snippet&key=' + C.YOUTUBE_API_KEY;
  youtubeOptions.path = encodeURI(requestUrl);
  /**
   *
   * @param {*} json
   */
  function setJson(json) {
    answerObject.youtube = json;
  }
  await fetch(youtubeOptions.url + requestUrl, youtubeOptions)
      .then((res) => res.json())
      .then((json) => {
        setJson(json);
        console.log(json);
      }).catch((e) => console.log(e));

  return answerObject;
}
/**
 *
 */
async function tokenSpotify() {
  let token;
  if (spotifyToken) {
    token = spotifyToken;
  } else {
    token = {key: '', date: 0};
  }

  console.log(new Date(token.date).toString());
  console.log(new Date(Date.now() + 3600000).toString());

  if (token.key === '' || Date.now() > token.expires || token.date === 0) {
    /**
     *
     * @param {*} json
     */
    function callback(json) {
      if (json) {
        const info = json;
        token = {
          key: info.access_token,
          date: Date.now(),
          expires: Date.now() + 3600000,
        };
        console.log(token.date.toString());
      } else {
        console.log(json);
      }
      console.log(token);
    }
    /**
     *
     */
    function error() {
      token = undefined;
    }

    await fetch(C.SPOTIFY_TOKEN_OPTIONS.url
        , C.SPOTIFY_TOKEN_OPTIONS)
        .then((res) => res.json())
        .then((json) => callback(json))
        .catch((e) => {
          console.log(e);
          error();
        });

    spotifyToken = token;
    return spotifyToken;
  } else {
    return {token: token.key, expires: token.expires};
  }
};
/**
 *
 * @param {*} request
 * @param {*} type
 */
async function spotify(request, type) {
  const answerObject = {spotify: ''};
  const {track, artist, id} = request;
  const isCorrect = (track && artist) || id;

  if (!isCorrect) {
    return answerObject;
  }

  const options = {
    ...C.SPOTIFY_OPTIONS,
    headers: {
      'Authorization': 'Bearer ',
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  };
  /**
   *
   * @param {*} token
   */
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
    case C.SEARCH_REQUEST:
      requestUrl = '/search?q=' + artist + ' ' + track + '&type=track';
      break;
    case C.TRACK_REQUEST:
      requestUrl = '/tracks/' + id;
      break;
    default:
      return answerObject;
  }
  /**
   *
   * @param {*} json
   */
  function setJson(json) {
    answerObject.spotify = json;
  }

  options.url += requestUrl;

  await fetch(options.url, options)
      .then((res) => res.json())
      .then((json) => setJson(json))
      .catch((e) => console.log(e));

  return answerObject;
}
/**
 *
 * @param {*} request
 * @param {*} type
 */
async function deezer(request, type) {
  const answerObject = {deezer: ''};
  const {track, artist, id} = request;
  const isCorrect = (track && artist) || id;

  if (!isCorrect) {
    return answerObject;
  }

  const options = {...C.DEEZER_OPTIONS};
  let requestUrl = options.url;
  switch (type) {
    case C.SEARCH_REQUEST:
      requestUrl += '/search?q=artist:"' + artist + '" track:"' + track + '"';
      break;
    case C.TRACK_REQUEST:
      requestUrl += '/track/' + id;
      break;
    default:
      return answerObject;
  }
  /**
   *
   * @param {*} json
   */
  function setJson(json) {
    answerObject.deezer = json;
    return answerObject.spotify;
  }

  await fetch(requestUrl, options)
      .then((res) => res.json())
      .then((json) => setJson(json))
      .catch((e) => console.log(e));

  return answerObject;
}

exports.youtube = youtube;
exports.spotify = spotify;
exports.deezer = deezer;
exports.tokenSpotify = tokenSpotify;
