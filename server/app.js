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
const const_1 = require("./const");
const requestModule_1 = require("./requestModule");
const searchModule_1 = require("./searchModule");
const BadResponse_1 = require("./Errors/BadResponse");
function createUrlCardForState(foundItem, service) {
    const artistTrack = searchModule_1.getArtistTrackInItem(service, foundItem);
    const card = Object.assign({}, artistTrack);
    let item;
    switch (service) {
        case const_1.Services.YOUTUBE:
            item = foundItem;
            card.url = 'https://www.youtube.com/watch?v=' + item.id.videoId;
            card.albumArt = item.snippet.thumbnails.medium.url;
            card.bigAlbumArt = item.snippet.thumbnails.high.url;
            break;
        case const_1.Services.SPOTIFY:
            item = foundItem;
            card.url = item.external_urls.spotify;
            card.albumArt = item.album.images[1].url;
            card.bigAlbumArt = item.album.images[0].url;
            break;
        case const_1.Services.DEEZER:
            item = foundItem;
            card.url = item.link;
            card.albumArt = item.album.cover_medium;
            card.bigAlbumArt = item.album.cover_big;
            break;
    }
    return card;
}
exports.createUrlCardForState = createUrlCardForState;
// ДОБАВИТЬ РАБОТУ С ID
function createObjectForState(artistTrack, requestedObject) {
    return __awaiter(this, void 0, void 0, function* () {
        const objectForState = {};
        let forCreateCard;
        let response;
        if (requestedObject) {
            if (requestedObject.youtube) {
                response = Object.assign({}, requestedObject.youtube);
                forCreateCard = searchModule_1.searchInYoutubeObject(response, artistTrack);
                objectForState.youtube = createUrlCardForState(forCreateCard, const_1.Services.YOUTUBE);
            }
            if (requestedObject.spotify) {
                response = Object.assign({}, requestedObject.spotify);
                forCreateCard = searchModule_1.searchInSpotifyObject(response, artistTrack);
                objectForState.spotify = createUrlCardForState(forCreateCard, const_1.Services.SPOTIFY);
            }
            if (requestedObject.deezer) {
                response = Object.assign({}, requestedObject.deezer);
                forCreateCard = searchModule_1.searchInDeezerObject(response, artistTrack);
                objectForState.deezer = createUrlCardForState(forCreateCard, const_1.Services.DEEZER);
            }
            return objectForState;
        }
    });
}
exports.createObjectForState = createObjectForState;
function fetchService(service, id) {
    return __awaiter(this, void 0, void 0, function* () {
        switch (service) {
            case const_1.Services.YOUTUBE:
                return yield requestModule_1.fetchYoutube(id, const_1.RequestType.TRACK_REQUEST);
            case const_1.Services.DEEZER:
                return yield requestModule_1.fetchDeezer(id, const_1.RequestType.TRACK_REQUEST);
            case const_1.Services.SPOTIFY:
                return yield requestModule_1.fetchSpotify(id, const_1.RequestType.TRACK_REQUEST);
            default:
                throw new Error("Wrong service" + service);
        }
    });
}
exports.fetchService = fetchService;
function searchEverywhere(artistTrackId) {
    return __awaiter(this, void 0, void 0, function* () {
        let { artist, track } = artistTrackId;
        try {
            artist = searchModule_1.eraseExcess(artist);
            track = searchModule_1.eraseExcess(track);
            const searchResult = yield searchModule_1.everywhere(artistTrackId);
            return yield createObjectForState(artistTrackId, searchResult);
        }
        catch (e) {
            console.error(e);
        }
    });
}
exports.searchEverywhere = searchEverywhere;
function searchById(service, id) {
    return __awaiter(this, void 0, void 0, function* () {
        const searchResult = yield fetchService(service, id);
        const isError = searchResult === null || searchResult === void 0 ? void 0 : searchResult.spotify;
        if (isError === null || isError === void 0 ? void 0 : isError.error) {
            throw new BadResponse_1.default(isError.error.message, service);
        }
        let item;
        switch (service) {
            case const_1.Services.SPOTIFY:
                item = Object.assign({}, searchResult.spotify);
                break;
            case const_1.Services.DEEZER:
                item = Object.assign({}, searchResult.deezer);
                break;
            case const_1.Services.YOUTUBE:
                const cast = Object.assign({}, searchResult.youtube);
                item = cast.items[0];
                break;
        }
        const artistTrack = searchModule_1.getArtistTrackInItem(service, item);
        return searchEverywhere(artistTrack);
    });
}
exports.searchById = searchById;
//# sourceMappingURL=app.js.map