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
            const regExp = new RegExp(substringSecond, 'i');
            if (substringFirst.search(regExp) !== -1) {
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
function searchInYoutubeObject(youtubeResponse, artistTrack) {
    const { artist, track } = Object.assign({}, artistTrack);
    const items = youtubeResponse.items;
    let similarObject;
    let foundFlag = false;
    for (const item of items) {
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
        for (const item of items) {
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
    const { tracks } = Object.assign({}, spotifyResponse);
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
    const { data } = Object.assign({}, deezerResponse);
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
function everywhere(artistTrack, withoutArr) {
    return __awaiter(this, void 0, void 0, function* () {
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
        if (!without.includes(cnst_1.Services.SPOTIFY)) {
            spotify = requestModules_1.fetchSpotify(artistTrack, cnst_1.RequestType.SEARCH_REQUEST)
                .catch((e) => {
                throw e;
            });
            promisesArr.push(spotify);
        }
        if (!without.includes(cnst_1.Services.YOUTUBE)) {
            youtube = requestModules_1.fetchYoutube(artistTrack, cnst_1.RequestType.SEARCH_REQUEST)
                .catch((e) => {
                throw e;
            });
            promisesArr.push(youtube);
        }
        if (!without.includes(cnst_1.Services.DEEZER)) {
            deezer = requestModules_1.fetchDeezer(artistTrack, cnst_1.RequestType.SEARCH_REQUEST)
                .catch((e) => {
                throw e;
            });
            promisesArr.push(deezer);
        }
        responseJson = yield Promise.allSettled(promisesArr)
            .then((values) => values.reduce((accumulator, currentValue) => {
            // @ts-ignore
            return Object.assign(Object.assign({}, accumulator), currentValue.value);
        }, {}));
        return responseJson;
    });
}
exports.everywhere = everywhere;
function fetchByArtistTrack(service, artistTrack) {
    return __awaiter(this, void 0, void 0, function* () {
        let { artist, track } = artistTrack;
        let index;
        let responseObj;
        switch (service) {
            case cnst_1.Services.YOUTUBE:
                let snippet;
                responseObj = yield requestModules_1.fetchYoutube(artistTrack, cnst_1.RequestType.TRACK_REQUEST).catch((e) => {
                    throw e;
                });
                const youtubeResponse = Object.assign({}, responseObj.youtube);
                const youtube = searchInYoutubeObject(youtubeResponse, artistTrack);
                snippet = youtube.snippet;
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
                responseObj = yield requestModules_1.fetchSpotify(artistTrack, cnst_1.RequestType.TRACK_REQUEST).catch((e) => {
                    throw e;
                });
                const spotifyResponse = Object.assign({}, responseObj.spotify);
                const spotify = searchInSpotifyObject(spotifyResponse, artistTrack);
                track = spotify.name;
                artist = spotify.artists[0].name;
                break;
            case cnst_1.Services.DEEZER:
                responseObj = yield requestModules_1.fetchDeezer(artistTrack, cnst_1.RequestType.TRACK_REQUEST).catch((e) => {
                    throw e;
                });
                const deezerResponse = Object.assign({}, responseObj.deezer);
                const deezer = searchInDeezerObject(deezerResponse, artistTrack);
                track = deezer.title_short;
                artist = deezer.artist.name;
                break;
        }
        return { artist, track };
    });
}
exports.fetchByArtistTrack = fetchByArtistTrack;
function getArtistTrackInResponse(service, artistTrack, response) {
    let { artist, track } = Object.assign({}, artistTrack);
    let index;
    let responseObj;
    switch (service) {
        case cnst_1.Services.YOUTUBE:
            let snippet;
            responseObj = Object.assign({}, response.youtube);
            const youtube = searchInYoutubeObject(responseObj, artistTrack);
            snippet = youtube.snippet;
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
            responseObj = Object.assign({}, response.spotify);
            const spotify = searchInSpotifyObject(responseObj, artistTrack);
            track = spotify.name;
            artist = spotify.artists[0].name;
            break;
        case cnst_1.Services.DEEZER:
            responseObj = Object.assign({}, response.deezer);
            const deezer = searchInDeezerObject(responseObj, artistTrack);
            track = deezer.title_short;
            artist = deezer.artist.name;
            break;
    }
    return { artist, track };
}
exports.getArtistTrackInResponse = getArtistTrackInResponse;
function getArtistTrackInItem(service, item) {
    let artist;
    let track;
    let index;
    let responseObj;
    switch (service) {
        case cnst_1.Services.YOUTUBE:
            let snippet;
            responseObj = item;
            snippet = responseObj.snippet;
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
            responseObj = item;
            track = responseObj.name;
            artist = responseObj.artists[0].name;
            break;
        case cnst_1.Services.DEEZER:
            responseObj = item;
            track = responseObj.title_short;
            artist = responseObj.artist.name;
            break;
        default:
            break;
    }
    return { artist, track };
}
exports.getArtistTrackInItem = getArtistTrackInItem;
function byId(service, request) {
    return __awaiter(this, void 0, void 0, function* () {
        const artistTrack = yield fetchByArtistTrack(service, request);
        const without = [service];
        return yield everywhere(artistTrack, without);
    });
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
//# sourceMappingURL=searchModules.js.map