const C = require('./consts');
const req = require('./requestModule');
/**
 *
 * @param {*} firstString
 * @param {*} secondString
 */
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
/**
 *
 * @param {*} youtubeReturnedObject
 * @param {*} objectToCompare
 */
function searchInYoutubeObject(youtubeReturnedObject, objectToCompare) {
  const {spotifyArtist, track} = objectToCompare;
  let similarObject = {notValid: 'Not Found2'};
  let foundFlag = false;

  for (const item of youtubeReturnedObject.items) {
    if (item.snippet.channelTitle.indexOf('- Topic') !== -1) {
      const validTitle = item.snippet.channelTitle.substring(
          0, item.snippet.channelTitle.indexOf(' - Topic'));
      if (!matchStringsWithoutSpecs(track, item.snippet.title) && !matchStringsWithoutSpecs(item.snippet.title, track)) {
        continue;
      }
      if (!matchStringsWithoutSpecs(spotifyArtist, validTitle) && !matchStringsWithoutSpecs(validTitle, spotifyArtist)) {
        continue;
      }
      similarObject = item;
      foundFlag = true;
      break;
    }
  }
  if (!foundFlag) {
    for (const item of youtubeReturnedObject.items) {
      if (!matchStringsWithoutSpecs(spotifyArtist + ' ' + track, item.snippet.title) &&
       !matchStringsWithoutSpecs(item.snippet.title, spotifyArtist + ' ' + track)) {
        continue;
      }
      similarObject = item;
      break;
    }
  }

  return similarObject;
}
/**
 *
 * @param {*} spotifyReturnedObject
 * @param {*} objectToCompare
 */
function searchInSpotifyObject(spotifyReturnedObject, objectToCompare) {
  const {artist, track} = objectToCompare;

  let similarObject = {notValid: 'Not Found2'};
  for (const item of spotifyReturnedObject.tracks.items) {
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

  return similarObject;
}
/**
 *
 * @param {*} deezerReturnedObject
 * @param {*} objectToCompare
 */
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

/**
 *
 * @param {*} request
 */
async function everywhere(request, withoutArr) {
  let responseJson = {...C.RESPONSE_JSON};
  let spotify;
  let youtube;
  let deezer;
  const promisesArr = [];
  let without;
  if (withoutArr === undefined) {
    without = [C.YOUTUBE, C.DEEZER, C.SPOTIFY];
  } else {
    without = withoutArr;
  }

  if (without.indexOf(C.SPOTIFY) === -1) {
    spotify = req.spotify(request, C.SEARCH_REQUEST);
    promisesArr.push(spotify);
  }
  if (without.indexOf(C.YOUTUBE) === -1) {
    youtube = req.youtube(request, C.SEARCH_REQUEST);
    promisesArr.push(youtube);
  }
  if (without.indexOf(C.DEEZER) === -1) {
    deezer = req.deezer(request, C.SEARCH_REQUEST);
    promisesArr.push(deezer);
  }

  responseJson = await Promise.allSettled(promisesArr)
      .then((values) =>
        values.reduce((accumulator, currentValue) => {
          return {...accumulator, ...currentValue.value};
        }, {}));

  return responseJson;
}

/**
 *
 * @param {*} request
 */
async function getArtistTrack(request) {
  const {id, service} = request;
  let artist;
  let track;
  let index;
  let requestedObj;
  let resultJson;

  if (service && id) {
    switch (service) {
      case C.YOUTUBE:
        requestedObj = await req.youtube(request,
            C.TRACK_REQUEST);
        const {snippet} = requestedObj.youtube.items[0];
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
        requestedObj = await req.spotify(request,
            C.TRACK_REQUEST);
        track = requestedObj.spotify.name;
        artist = requestedObj.artists[0].name;
        break;
      case C.DEEZER:
        requestedObj = await req.deezer(request,
            C.TRACK_REQUEST);
        track = requestedObj.deezer.title_short;
        artist = requestedObj.deezer.artist.name;
        break;
      default:
        break;
    }
  }

  if (requestedObj) {
    resultJson = {
      artist,
      track,
    };
  }

  return resultJson;
}

/**
 *
 * @param {*} request
 */
async function byId(request) {
  const artistTrack = await getArtistTrack(request);
  const {service} = request;
  const without = [service];
  const requestedObject = await everywhere(artistTrack, without);

  return requestedObject;
}

exports.everywhere = everywhere;
exports.getArtistTrack = getArtistTrack;
exports.byId = byId;
