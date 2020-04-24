import {RequestType, Services} from "./const";
import IToCompare from "./Interfaces/IToCompare";
import IResponse from "./Interfaces/IResponse";
import {fetchDeezer, fetchSpotify, fetchYoutube} from "./requestModule";
import ISpotifySearch from "./Interfaces/Spotify/ISpotifySearch";
import IYoutubeSearch from "./Interfaces/Youtube/IYoutubeSearch";
import IYoutubeItem from "./Interfaces/Youtube/IYoutubeItem";
import ISpotifyItem from "./Interfaces/Spotify/ISpotifyItem";
import IDeezerSearch from "./Interfaces/Deezer/IDeezerSearch";
import IDeezerItem from "./Interfaces/Deezer/IDeezerItem";
import IArtistTrack from "./Interfaces/IArtistTrack";
import NotFoundMatch from "./Errors/NotFoundMatch";
import {instanceOf} from "prop-types";

export function matchStringsWithoutSpecs(firstString: string, secondString: string): boolean {
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
        let indicator: boolean = false;
        for (const substringSecond of splitedSecondString) {
            const regExp = new RegExp(substringSecond, 'i');

            if (substringFirst.search(regExp) !== -1) {
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

export function searchInYoutubeObject(youtubeResponse: IYoutubeSearch, artistTrack: IArtistTrack): IYoutubeItem {
    const {artist, track} = {...artistTrack};
    const items = youtubeResponse.items;
    let similarObject: IYoutubeItem;
    let foundFlag = false;

    for (const item of items) {
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

export function searchInSpotifyObject(spotifyResponse: ISpotifySearch, artistTrack: IArtistTrack): ISpotifyItem {
    const {artist, track} = artistTrack;
    const {tracks} = {...spotifyResponse};
    let similarObject: ISpotifyItem;
    if (artist && track && tracks) {

        for (const item of tracks.items) {
            let validator = false;

            if (item.type === 'track') {
                if (!matchStringsWithoutSpecs(track, item.name) &&
                    !matchStringsWithoutSpecs(item.name, track)) {
                    continue;
                }

                for (const spotifyArtist of item.artists) {
                    if (matchStringsWithoutSpecs(artist, spotifyArtist.name) &&
                        matchStringsWithoutSpecs(spotifyArtist.name, artist)) {
                        validator = true;
                        break;
                    } else {
                        validator = false;
                    }
                }
                similarObject = item as ISpotifyItem;

                if (validator) {
                    return similarObject;
                }
            }
        }
    }
    if(typeof similarObject === "undefined"){
        throw new NotFoundMatch("Not found match in Spotify items",artistTrack,spotifyResponse);
    }

    return similarObject;
}

export function searchInDeezerObject(deezerResponse: IDeezerSearch, objectToCompare: IToCompare): IDeezerItem {
    const {artist, track} = objectToCompare;
    let similarObject: IDeezerItem;
    const {data} = {...deezerResponse};

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

/** @returns Response from all services in one object */
export async function everywhere(artistTrack: IToCompare, withoutArr?: Services[]): Promise<IResponse> {
    let responseJson: IResponse;
    let spotify: any;
    let youtube: any;
    let deezer: any;
    const promisesArr = [];
    let without;
    if (withoutArr) {
        without = withoutArr;
    } else {
        without = [];
    }

    if (!without.includes(Services.SPOTIFY)) {
        spotify = fetchSpotify(artistTrack, RequestType.SEARCH_REQUEST)
            .catch((e) => {
                throw e
            });
        promisesArr.push(spotify);
    }
    if (!without.includes(Services.YOUTUBE)) {
        youtube = fetchYoutube(artistTrack, RequestType.SEARCH_REQUEST)
            .catch((e) => {
                throw e
            });
        promisesArr.push(youtube);
    }
    if (!without.includes(Services.DEEZER)) {
        deezer = fetchDeezer(artistTrack, RequestType.SEARCH_REQUEST)
            .catch((e) => {
                throw e
            });
        promisesArr.push(deezer);
    }

    responseJson = await Promise.allSettled(promisesArr)
        .then((values) =>
            values.reduce((accumulator, currentValue) => {
                // @ts-ignore
                return {...accumulator, ...currentValue.value};
            }, {}));

    return responseJson;
}

export async function fetchByArtistTrack(service: Services, artistTrack: IArtistTrack): Promise<IArtistTrack> {
    let {artist, track} = artistTrack;
    let index: number;
    let responseObj: IResponse;

    switch (service) {
        case Services.YOUTUBE:
            let snippet;
            responseObj = await fetchYoutube(artistTrack,
                RequestType.TRACK_REQUEST).catch((e) => {
                throw e;
            })
            const youtubeResponse = {...responseObj.youtube} as IYoutubeSearch
            const youtube = searchInYoutubeObject(youtubeResponse, artistTrack);
            snippet = youtube.snippet;
            index = snippet.title.indexOf('-');

            if (index !== -1) {
                artist = snippet.title.substring(0, index).trim();
                track = snippet.title.substring(index + 1, snippet.title.length).trim();
            } else {
                artist = snippet.channelTitle.trim();
                track = snippet.title.trim();
            }
            break;
        case Services.SPOTIFY:
            responseObj = await fetchSpotify(artistTrack,
                RequestType.TRACK_REQUEST).catch((e) => {
                throw e;
            });
            const spotifyResponse = {...responseObj.spotify} as ISpotifySearch;
            const spotify = searchInSpotifyObject(spotifyResponse, artistTrack);
            track = spotify.name;
            artist = spotify.artists[0].name;
            break;
        case Services.DEEZER:
            responseObj = await fetchDeezer(artistTrack,
                RequestType.TRACK_REQUEST).catch((e) => {
                throw e;
            });
            const deezerResponse = {...responseObj.deezer} as IDeezerSearch;
            const deezer = searchInDeezerObject(deezerResponse, artistTrack);
            track = deezer.title_short;
            artist = deezer.artist.name;
            break;
    }

    return {artist, track};
}

export function getArtistTrackInResponse(service: Services, artistTrack: IArtistTrack, response: IResponse): IArtistTrack {
    let artist;
    let track
    let index: number;
    let responseObj;

    switch (service) {
        case Services.YOUTUBE:
            let snippet;
            responseObj = {...response.youtube};
            const youtube = searchInYoutubeObject(responseObj, artistTrack);
            snippet = youtube.snippet;
            index = snippet.title.indexOf('-');
            if (index !== -1) {
                artist = snippet.title.substring(0, index).trim();
                track = snippet.title.substring(index + 1, snippet.title.length).trim();
            } else {
                artist = snippet.channelTitle.trim();
                track = snippet.title.trim();
            }
            break;
        case Services.SPOTIFY:
            responseObj = {...response.spotify};
            const spotify = searchInSpotifyObject(responseObj, artistTrack);
            track = spotify.name;
            artist = spotify.artists[0].name;
            break;
        case Services.DEEZER:
            responseObj = {...response.deezer};
            const deezer = searchInDeezerObject(responseObj, artistTrack);
            track = deezer.title_short;
            artist = deezer.artist.name;
            break;
    }

    return {artist, track}
}

export function getArtistTrackInItem(service: Services, item: IDeezerItem | IYoutubeItem | ISpotifyItem): IArtistTrack {
    let artist;
    let track;
    let index: number;
    let responseObj: IDeezerItem | IYoutubeItem | ISpotifyItem;

    switch (service) {
        case Services.YOUTUBE:
            let snippet;
            responseObj = item as IYoutubeItem;
            snippet = responseObj.snippet;
            index = snippet.title.indexOf('-');
            if (index !== -1) {
                artist = snippet.title.substring(0, index).trim();
                track = snippet.title.substring(index + 1, snippet.title.length).trim();
            } else {
                artist = snippet.channelTitle.trim();
                track = snippet.title.trim();
            }
            break;
        case Services.SPOTIFY:
            responseObj = item as ISpotifyItem;
            track = responseObj.name;
            artist = responseObj.artists[0].name;
            break;
        case Services.DEEZER:
            responseObj = item as IDeezerItem;
            track = responseObj.title_short;
            artist = responseObj.artist.name;
            break;
        default:
            break;
    }

    return {artist, track}
}

export async function byId(service: Services, request: IToCompare): Promise<IResponse> {
    const artistTrack = await fetchByArtistTrack(service, request as IArtistTrack);
    const without = [service];
    return await everywhere(artistTrack, without);
}

function eraseBrackets(name: string): string {
    let result = name;
    let index: number;
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

function eraseFeat(trackName: string): string {
    let result = trackName;
    let index: number;
    const regex = new RegExp(/feat/i)
    if (trackName.search(regex) !== -1) {
        index = trackName.search(regex);
        result = trackName.substring(0, index);
    }

    return result;
}

export function eraseExcess(trackName: string): string {
    return eraseBrackets(eraseFeat(trackName));
}
