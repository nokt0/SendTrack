"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cnst_1 = require("./cnst");
const searchModules_1 = require("./searchModules");
const searchModules_2 = require("./searchModules");
async function createUrlCardForState(requestedObject, service) {
    const artistTrack = await searchModules_2.getArtistTrack({ "service": service }, requestedObject);
    const card = { ...artistTrack };
    const { youtube, spotify, deezer } = requestedObject;
    switch (service) {
        case cnst_1.Services.YOUTUBE:
            card.url = 'https://www.youtube.com/watch?v=' + youtube.id.videoId;
            card.albumArt = youtube.snippet.thumbnails.medium.url;
            break;
        case cnst_1.Services.SPOTIFY:
            card.url = spotify.album.external_urls.spotify;
            card.albumArt = spotify.album.images[1].url;
            card.bigAlbumArt = spotify.album.images[0].url;
            break;
        case cnst_1.Services.DEEZER:
            card.url = deezer.link;
            card.albumArt = deezer.album.cover_medium;
            break;
    }
    return card;
}
exports.createUrlCardForState = createUrlCardForState;
// ДОБАВИТЬ РАБОТУ С ID
async function createObjectForState(artistTrack, requestedObject) {
    const { youtube, spotify, deezer } = requestedObject;
    const objectForState = {};
    let forCreateCard;
    if (requestedObject) {
        if (requestedObject.youtube) {
            objectForState.youtube = searchModules_2.searchInYoutubeObject(youtube, artistTrack);
            forCreateCard = {
                requestedObject: {
                    "youtube": youtube
                },
                service: cnst_1.Services.YOUTUBE
            };
            objectForState.youtube = await createUrlCardForState(objectForState, cnst_1.Services.YOUTUBE);
        }
        if (requestedObject.spotify) {
            objectForState.spotify = searchModules_2.searchInSpotifyObject(spotify, artistTrack);
            forCreateCard = {
                requestedObject: {
                    "spotify": spotify
                },
                service: cnst_1.Services.SPOTIFY
            };
            objectForState.spotify = await createUrlCardForState(objectForState, cnst_1.Services.SPOTIFY);
        }
        if (requestedObject.deezer) {
            objectForState.deezer = searchModules_2.searchInDeezerObject(deezer, artistTrack);
            forCreateCard = {
                requestedObject: {
                    "deezer": deezer
                },
                service: cnst_1.Services.DEEZER
            };
            objectForState.deezer = await createUrlCardForState(objectForState, cnst_1.Services.DEEZER);
        }
        return objectForState;
    }
}
exports.createObjectForState = createObjectForState;
async function searchEverywhere(artistTrackId) {
    let { artist, track } = artistTrackId;
    try {
        artist = searchModules_1.eraseExcess(artist);
        track = searchModules_1.eraseExcess(track);
        const searchResult = await searchModules_2.everywhere(artistTrackId);
        return await createObjectForState(artistTrackId, searchResult);
    }
    catch (e) {
        console.error(e);
    }
}
exports.searchEverywhere = searchEverywhere;
async function searchById(request) {
    const { id, service } = request;
    let artist;
    let track;
    const searchResult = await searchModules_2.byId({ "id": id, "service": service });
    const artistTrack = await searchModules_2.getArtistTrack({ "requestedObject": searchResult.spotify });
    return await createObjectForState(artistTrack, searchResult);
}
exports.searchById = searchById;
//# sourceMappingURL=apps.js.map