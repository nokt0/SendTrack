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
const searchModules_1 = require("./searchModules");
function createUrlCardForState(foundItem, service) {
    return __awaiter(this, void 0, void 0, function* () {
        const artistTrack = yield searchModules_1.getArtistTrackInItem(service, foundItem);
        const card = Object.assign({}, artistTrack);
        let item;
        switch (service) {
            case cnst_1.Services.YOUTUBE:
                item = foundItem;
                card.url = 'https://www.youtube.com/watch?v=' + item.id.videoId;
                card.albumArt = item.snippet.thumbnails.medium.url;
                card.bigAlbumArt = item.snippet.thumbnails.high.url;
                break;
            case cnst_1.Services.SPOTIFY:
                item = foundItem;
                card.url = item.album.external_urls.spotify;
                card.albumArt = item.album.images[1].url;
                card.bigAlbumArt = item.album.images[0].url;
                break;
            case cnst_1.Services.DEEZER:
                item = foundItem;
                card.url = item.link;
                card.albumArt = item.album.cover_medium;
                card.bigAlbumArt = item.album.cover_big;
                break;
        }
        return card;
    });
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
                forCreateCard = searchModules_1.searchInYoutubeObject(response, artistTrack);
                objectForState.youtube = yield createUrlCardForState(forCreateCard, cnst_1.Services.YOUTUBE);
            }
            if (requestedObject.spotify) {
                response = Object.assign({}, requestedObject.spotify);
                forCreateCard = searchModules_1.searchInSpotifyObject(response, artistTrack);
                objectForState.spotify = yield createUrlCardForState(forCreateCard, cnst_1.Services.SPOTIFY);
            }
            if (requestedObject.deezer) {
                response = Object.assign({}, requestedObject.deezer);
                forCreateCard = searchModules_1.searchInDeezerObject(response, artistTrack);
                objectForState.deezer = yield createUrlCardForState(forCreateCard, cnst_1.Services.DEEZER);
            }
            return objectForState;
        }
    });
}
exports.createObjectForState = createObjectForState;
function searchEverywhere(artistTrackId) {
    return __awaiter(this, void 0, void 0, function* () {
        let { artist, track } = artistTrackId;
        try {
            artist = searchModules_1.eraseExcess(artist);
            track = searchModules_1.eraseExcess(track);
            const searchResult = yield searchModules_1.everywhere(artistTrackId);
            return yield createObjectForState(artistTrackId, searchResult);
        }
        catch (e) {
            console.error(e);
        }
    });
}
exports.searchEverywhere = searchEverywhere;
/*
export async function searchById(request: IToCompare) {
    const {id, service} = request;
    const searchResult = await byId(service,request);
    const artistTrack = await getArtistTrackInResponse(service, )
    return await createObjectForState(artistTrack, searchResult);
}
*/
//# sourceMappingURL=apps.js.map