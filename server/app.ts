'use strict';
import {RequestType, Services} from './const'
import IToCompare from './Interfaces/IToCompare';
import {fetchDeezer, fetchSpotify, fetchYoutube} from './requestModule'
import {
    eraseExcess,
    everywhere,
    getArtistTrackInItem,
    searchInDeezerObject,
    searchInSpotifyObject,
    searchInYoutubeObject
} from './searchModule'
import IResponse from "./Interfaces/IResponse";
import IUrlCard from "./Interfaces/IUrlCard";
import IUrlCards from "./Interfaces/IUrlCards";
import IYoutubeItem from "./Interfaces/Youtube/IYoutubeItem";
import IDeezerItem from "./Interfaces/Deezer/IDeezerItem";
import ISpotifyItem from "./Interfaces/Spotify/ISpotifyItem";
import IArtistTrack from "./Interfaces/IArtistTrack";
import IYoutubeSearch from "./Interfaces/Youtube/IYoutubeSearch";
import IDeezerSearch from "./Interfaces/Deezer/IDeezerSearch";
import ISpotifySearch from "./Interfaces/Spotify/ISpotifySearch";
import IncorrectRequest from "./Errors/IncorrectRequest";

export function createUrlCardForState(foundItem: ISpotifyItem | IYoutubeItem | IDeezerItem, service: Services) {
    const artistTrack = getArtistTrackInItem(service, foundItem);
    const card = {...artistTrack} as IUrlCard;
    let item: ISpotifyItem | IYoutubeItem | IDeezerItem;
    switch (service) {
        case Services.YOUTUBE:
            item = foundItem as IYoutubeItem;
            card.url = 'https://www.youtube.com/watch?v=' + item.id.videoId;
            card.albumArt = item.snippet.thumbnails.medium.url;
            card.bigAlbumArt = item.snippet.thumbnails.high.url
            break;
        case Services.SPOTIFY:
            item = foundItem as ISpotifyItem;
            card.url = item.album.external_urls.spotify;
            card.albumArt = item.album.images[1].url;
            card.bigAlbumArt = item.album.images[0].url;
            break;
        case Services.DEEZER:
            item = foundItem as IDeezerItem;
            card.url = item.link;
            card.albumArt = item.album.cover_medium;
            card.bigAlbumArt = item.album.cover_big;
            break;
    }
    return card;
}

// ДОБАВИТЬ РАБОТУ С ID
export async function createObjectForState(artistTrack: IArtistTrack, requestedObject: IResponse) {
    const objectForState: IUrlCards = {} as IUrlCards;
    let forCreateCard: IYoutubeItem | IDeezerItem | ISpotifyItem;
    let response: IYoutubeSearch | ISpotifySearch | IDeezerSearch;

    if (requestedObject) {
        if (requestedObject.youtube) {
            response = {...requestedObject.youtube} as IYoutubeSearch;
            forCreateCard = searchInYoutubeObject(response, artistTrack);
            objectForState.youtube = createUrlCardForState(forCreateCard, Services.YOUTUBE);
        }
        if (requestedObject.spotify) {
            response = {...requestedObject.spotify} as ISpotifySearch;
            forCreateCard = searchInSpotifyObject(response, artistTrack);
            objectForState.spotify = createUrlCardForState(forCreateCard, Services.SPOTIFY);
        }
        if (requestedObject.deezer) {
            response = {...requestedObject.deezer} as IDeezerSearch;
            forCreateCard = searchInDeezerObject(response, artistTrack);
            objectForState.deezer = createUrlCardForState(forCreateCard, Services.DEEZER);
        }
        return objectForState;
    }
}

export async function fetchService(service: Services, id: IToCompare) {
    switch (service) {
        case Services.YOUTUBE:
            return await fetchYoutube(id, RequestType.TRACK_REQUEST);
        case Services.DEEZER:
            return await fetchDeezer(id, RequestType.TRACK_REQUEST);
        case Services.SPOTIFY:
            return await fetchSpotify(id, RequestType.TRACK_REQUEST);
        default:
            throw new Error("Wrong service" + service)
    }
}

export async function searchEverywhere(artistTrackId: IArtistTrack) {
    let {artist, track} = artistTrackId;
    try {
        artist = eraseExcess(artist);
        track = eraseExcess(track);
        const searchResult = await everywhere(artistTrackId);
        return await createObjectForState(artistTrackId, searchResult);
    } catch (e) {
        console.error(e);
    }
}

export async function searchById(service: Services, id: IToCompare) {
    const searchResult = await fetchService(service, id);
    let item: ISpotifyItem|IDeezerItem|IYoutubeItem ;
    switch (service) {
        case Services.SPOTIFY:
            item = {...searchResult.spotify} as ISpotifyItem;
            break;
        case Services.DEEZER:
            item = {...searchResult.deezer} as IDeezerItem;
            break;
        case Services.YOUTUBE:
            item = {...searchResult.youtube} as IYoutubeItem;
            break;
    }
    const artistTrack = getArtistTrackInItem(service,item);
    return searchEverywhere(artistTrack);
}


