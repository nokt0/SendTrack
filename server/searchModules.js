"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cnst_1 = require("./cnst");
const requestModules_1 = require("./requestModules");
function matchStringsWithoutSpecs(firstString, secondString) {
    const reg = new RegExp('[\\s-\\]\\[)(\\/.&]', 'i');
    let splitedFirstString = firstString.split(reg);
    let splitedSecondString = secondString.split(reg);
    splitedFirstString = splitedFirstString.filter((el) => el !== '');
    splitedSecondString = splitedSecondString.filter((el) => el !== '');
    /*   // LOG
    logArray.push('Splited first string:[' + splitedFirstString.toString() + ']\n')
    console.log(logArray[logArray.length - 1])
    logArray.push('Splited second string:[' + splitedSecondString.toString() + ']\n')
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
            }
            else {
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
exports.matchStringsWithoutSpecs = matchStringsWithoutSpecs;
function searchInYoutubeObject(youtubeReturnedObject, objectToCompare) {
    const { artist, track } = objectToCompare;
    let similarObject;
    let foundFlag = false;
    for (const item of youtubeReturnedObject.items) {
        if (item.snippet.channelTitle.indexOf('- Topic') !== -1) {
            const validTitle = item.snippet.channelTitle.substring(0, item.snippet.channelTitle.indexOf(' - Topic'));
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
exports.searchInYoutubeObject = searchInYoutubeObject;
function searchInSpotifyObject(spotifyResponse, objectToCompare) {
    const { artist, track } = objectToCompare;
    const { tracks } = spotifyResponse;
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
                    }
                    else {
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
exports.searchInSpotifyObject = searchInSpotifyObject;
function searchInDeezerObject(deezerResponse, objectToCompare) {
    const { artist, track } = objectToCompare;
    let similarObject;
    const { data } = deezerResponse;
    for (const item of data) {
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
exports.searchInDeezerObject = searchInDeezerObject;
/** @returns Response from all services in one object */
async function everywhere(artistTrack, withoutArr) {
    let responseJson;
    let spotify;
    let youtube;
    let deezer;
    const promisesArr = [];
    let without;
    if (withoutArr) {
        without = withoutArr;
    }
    else {
        without = [];
    }
    if (without.includes(cnst_1.Services.SPOTIFY)) {
        spotify = requestModules_1.fetchSpotify(artistTrack, cnst_1.RequestType.SEARCH_REQUEST)
            .catch((e) => {
            throw e;
        });
        promisesArr.push(spotify);
    }
    if (without.includes(cnst_1.Services.YOUTUBE)) {
        youtube = requestModules_1.fetchYoutube(artistTrack, cnst_1.RequestType.SEARCH_REQUEST)
            .catch((e) => {
            throw e;
        });
        promisesArr.push(youtube);
    }
    if (without.includes(cnst_1.Services.DEEZER)) {
        deezer = requestModules_1.fetchDeezer(artistTrack, cnst_1.RequestType.SEARCH_REQUEST)
            .catch((e) => {
            throw e;
        });
        promisesArr.push(deezer);
    }
    responseJson = await Promise.allSettled(promisesArr)
        .then((values) => values.reduce((accumulator, currentValue) => {
        // @ts-ignore
        return { ...accumulator, ...currentValue.value };
    }, {}));
    return responseJson;
}
exports.everywhere = everywhere;
async function getArtistTrack(toCompare, response) {
    const { id, service } = toCompare;
    let { artist, track } = toCompare;
    let index;
    let resultJson;
    let responseObj;
    switch (service) {
        case cnst_1.Services.YOUTUBE:
            let snippet;
            if (response) {
                responseObj = response;
                snippet = responseObj.youtube.snippet;
            }
            else {
                snippet = response.youtube;
                responseObj = await requestModules_1.fetchYoutube(toCompare, cnst_1.RequestType.TRACK_REQUEST).catch((e) => {
                    throw e;
                });
            }
            index = snippet.title.indexOf('-');
            if (index !== -1) {
                artist = snippet.title.substring(0, index).trim();
                track = snippet.title.substring(index + 1, snippet.title.length).trim();
            }
            else {
                artist = snippet.channelTitle.trim();
                track = snippet.title.trim();
            }
            break;
        case cnst_1.Services.SPOTIFY:
            if (response) {
                responseObj = response;
            }
            else {
                responseObj = await requestModules_1.fetchSpotify(toCompare, cnst_1.RequestType.TRACK_REQUEST).catch((e) => {
                    throw e;
                });
            }
            track = responseObj.spotify.name;
            artist = responseObj.spotify.artists[0].name;
            break;
        case cnst_1.Services.DEEZER:
            if (response) {
                responseObj = response;
            }
            else {
                responseObj = await requestModules_1.fetchDeezer(toCompare, cnst_1.RequestType.TRACK_REQUEST).catch((e) => {
                    throw e;
                });
            }
            track = responseObj.deezer.title_short;
            artist = responseObj.deezer.artist.name;
            break;
        default:
            break;
    }
    if (responseObj) {
        resultJson = {
            artist,
            track,
        };
        return resultJson;
    }
}
exports.getArtistTrack = getArtistTrack;
async function byId(request) {
    const { service } = request;
    const artistTrack = await getArtistTrack(request);
    const without = [service];
    return await everywhere(artistTrack, without);
}
exports.byId = byId;
function eraseBrackets(name) {
    let result = name;
    let index;
    if (name.indexOf('(') !== -1 && name.indexOf(')') !== -1) {
        index = name.indexOf('(');
        result = name.substring(0, index) + name.substring(name.indexOf(')') + 1, name.length);
    }
    if (name.indexOf('[') !== -1 && name.indexOf(']') !== -1) {
        index = name.indexOf('[');
        result = name.substring(0, index) + name.substring(name.indexOf(']') + 1, name.length);
    }
    return result;
}
function eraseFeat(trackName) {
    let result = trackName;
    let index;
    const regex = new RegExp(/feat/i);
    if (trackName.search(regex) !== -1) {
        index = trackName.search(regex);
        result = trackName.substring(0, index);
    }
    return result;
}
function eraseExcess(trackName) {
    return eraseBrackets(eraseFeat(trackName));
}
exports.eraseExcess = eraseExcess;
exports.everywhere = everywhere;
exports.getArtistTrack = getArtistTrack;
exports.byId = byId;
exports.eraseExcess = eraseExcess;
exports.searchInYoutubeObject = searchInYoutubeObject;
exports.searchInSpotifyObject = searchInSpotifyObject;
exports.searchInDeezerObject = searchInDeezerObject;
//# sourceMappingURL=searchModules.js.map