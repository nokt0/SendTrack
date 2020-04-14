const C = require('./consts');
const req = require('./requestModules');

function matchStringsWithoutSpecs(firstString, secondString) {
  const reg = new RegExp('[\\s-\\]\\[\\)\\(\\/\\.&]', 'i');
  let splitedFirstString = firstString.split(reg);
  let splitedSecondString = secondString.split(reg);
  splitedFirstString = splitedFirstString.filter((el) => el !== '');
  splitedSecondString = splitedSecondString.filter((el) => el !== '');

  /*   // LOG
  logArray.push('Splitted first string:[' + splitedFirstString.toString() + ']\n')
  console.log(logArray[logArray.length - 1])
  logArray.push('Splitted second string:[' + splitedSecondString.toString() + ']\n')
  console.log(logArray[logArray.length - 1])
  // */

  for (const substringFirst of splitedFirstString) {
    let indicator = false;
    for (const substringSecond of splitedSecondString) {
      const reg = new RegExp(substringSecond, 'i');

      if (substringFirst.search(reg) !== -1) {
        indicator = true;
        console.log('Found');
        break;
      } else {
        indicator = false;
      }
    }
    if (!indicator) {
      /* // LOG
      logArray.push('Not equal\n')
      console.log(logArray[logArray.length - 1])
      // */
      return false;
    }
  }
  /* // LOG
  logArray.push('Equal\n')
  console.log(logArray[logArray.length - 1])
  // */
  return true;
}

function searchInYoutubeObject(youtubeReturnedObject, objectToCompare) {
  const {artist, track} = objectToCompare;
  let similarObject = {notValid: 'Not Found2'};
  let foundFlag = false;

  for (const item of youtubeReturnedObject.items) {
    if (item.snippet.channelTitle.indexOf('- Topic') !== -1) {
      const validTitle = item.snippet.channelTitle.substring(
        0, item.snippet.channelTitle.indexOf(' - Topic'));
      if (!matchStringsWithoutSpecs(track, item.snippet.title) && !matchStringsWithoutSpecs(item.snippet.title, track)) {
        continue;
      }
      if (!matchStringsWithoutSpecs(artist, validTitle) && !matchStringsWithoutSpecs(validTitle, artist)) {
        continue;
      }
      similarObject = item;
      foundFlag = true;
      break;
    }
  }
  if (!foundFlag) {
    for (const item of youtubeReturnedObject.items) {
      if (!matchStringsWithoutSpecs(artist + ' ' + track, item.snippet.title) &&
        !matchStringsWithoutSpecs(item.snippet.title, artist + ' ' + track)) {
        continue;
      }
      similarObject = item;
      break;
    }
  }

  return similarObject;
}

function searchInSpotifyObject(spotifyReturnedObject, objectToCompare) {
  const {artist, track} = objectToCompare;
  const {tracks} = spotifyReturnedObject;
  let similarObject;
  if (artist && track && tracks) {

    for (const item of tracks.items) {
      let validator = false;

      if (item.type === 'track') {
        if (!matchStringsWithoutSpecs(artist, item.name) &&
          !matchStringsWithoutSpecs(item.name, artist)) {
          continue;
        }

        for (const spotifyArtist of item.artists) {
          if (matchStringsWithoutSpecs(track, spotifyArtist.name) &&
            matchStringsWithoutSpecs(spotifyArtist.name, track)) {
            validator = true;
            break;
          } else {
            validator = false;
          }
        }
        similarObject = item;

        if (validator) {
          return similarObject;
        }
      }
    }
  }

  return similarObject;
}

function searchInDeezerObject(deezerReturnedObject, objectToCompare) {
  const {artist, track} = objectToCompare;
  let similarObject = {notValid: 'Not Found2'};
  for (const item of deezerReturnedObject.data) {
    if (item.type === 'track') {
      if (!matchStringsWithoutSpecs(track, item.title) &&
        !matchStringsWithoutSpecs(item.title, track)) {
        continue;
      }

      if (matchStringsWithoutSpecs(artist, item.artist.name) &&
        matchStringsWithoutSpecs(item.artist.name, artist)) {
        similarObject = item;
        break;
      }
    }
  }
  return similarObject;
}

async function everywhere(artistTrack, withoutArr) {
  let responseJson = {...C.RESPONSE_JSON};
  let spotify;
  let youtube;
  let deezer;
  const promisesArr = [];
  let without;
  if (withoutArr === undefined) {
    without = [];
  } else {
    without = withoutArr;
  }

  if (without.indexOf(C.SPOTIFY) === -1) {
    spotify = req.fetchSpotify(artistTrack, C.SEARCH_REQUEST);
    promisesArr.push(spotify);
  }
  if (without.indexOf(C.YOUTUBE) === -1) {
    youtube = req.fetchYoutube(artistTrack, C.SEARCH_REQUEST);
    promisesArr.push(youtube);
  }
  if (without.indexOf(C.DEEZER) === -1) {
    deezer = req.fetchDeezer(artistTrack, C.SEARCH_REQUEST);
    promisesArr.push(deezer);
  }

  responseJson = await Promise.allSettled(promisesArr)
    .then((values) =>
      values.reduce((accumulator, currentValue) => {
        return {...accumulator, ...currentValue.value};
      }, {}));

  return responseJson;
}

async function getArtistTrack(request) {
  const { id, service} = request;
  let {artist,track,requestedObject} = request;
  let index;
  let resultJson;
  let requestedObj;

    switch (service) {
      case C.YOUTUBE:
        let snippet;
        if(requestedObject){
          requestedObj = requestedObject;
          snippet = requestedObj.youtube.snippet;
        }else{
          snippet = requestedObject.youtube;
          requestedObj = await req.fetchYoutube(request,
            C.TRACK_REQUEST);
        }
        index = snippet.title.indexOf('-');

        if (index !== -1) {
          artist = snippet.title.substring(0, index).trim();
          track = snippet.title.substring(index + 1, snippet.title.length).trim();
        } else {
          artist = snippet.channelTitle.trim();
          track = snippet.title.trim();
        }
        break;
      case C.SPOTIFY:
        if(requestedObject){
        requestedObj = requestedObject;
        }else{
          requestedObj = await req.fetchSpotify(request,
            C.TRACK_REQUEST);
        }
        track = requestedObj.spotify.name;
        artist = requestedObj.spotify.artists[0].name;
        break;
      case C.DEEZER:
        if(requestedObject){
          requestedObj = requestedObject;
        }else{
          requestedObj = await req.fetchDeezer(request,
            C.TRACK_REQUEST);
        }
        track = requestedObj.deezer.title_short;
        artist = requestedObj.deezer.artist.name;
        break;
      default:
        break;
  }

  if (requestedObj) {
    resultJson = {
      artist,
      track,
    };
  }

  return resultJson;
}

async function byId(request) {
  const artistTrack = await getArtistTrack(request);
  const {service} = request;
  const without = [service];
  const requestedObject = await everywhere(artistTrack, without);

  return requestedObject;
}

function eraseBrackets(str) {
  let result = str;
  let index;
  if (str.indexOf('(') !== -1 && str.indexOf(')') !== -1) {
    index = str.indexOf('(');
    result = str.substring(0, index) + str.substring(str.indexOf(')') + 1, str.length);
  }

  if (str.indexOf('[') !== -1 && str.indexOf(']') !== -1) {
    index = str.indexOf('[');
    result = str.substring(0, index) + str.substring(str.indexOf(']') + 1, str.length);
  }

  return result;
}

function eraseFeat(str) {
  let result = str;
  let index;
  if (str.indexOf(/feat/i) !== -1) {
    index = str.indexOf(/feat/i);
    result = str.substring(0, index);
  }

  return result;
}

function eraseExcess(str){
  return eraseBrackets(eraseFeat(str));
}


exports.everywhere = everywhere;
exports.getArtistTrack = getArtistTrack;
exports.byId = byId;
exports.eraseExcess = eraseExcess;
exports.searchInYoutubeObject = searchInYoutubeObject;
exports.searchInSpotifyObject = searchInSpotifyObject;
exports.searchInDeezerObject = searchInDeezerObject;
