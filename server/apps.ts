import {Services} from './cnst'
import IToCompare from './Interfaces/IToCompare';
import {} from './requestModules'
import {
    eraseExcess,
    getArtistTrackInItem,
    everywhere,
    byId,
    searchInDeezerObject,
    searchInYoutubeObject,
    searchInSpotifyObject, getArtistTrackInResponse
} from './searchModules'
import IResponse from "./Interfaces/IResponse";
import IFoundItems from "./Interfaces/IFoundItems";
import IUrlCard from "./Interfaces/IUrlCard";
import IUrlCards from "./Interfaces/IUrlCards";
import IYoutubeItem from "./Interfaces/Youtube/IYoutubeItem";
import IDeezerItem from "./Interfaces/Deezer/IDeezerItem";
import ISpotifyItem from "./Interfaces/Spotify/ISpotifyItem";
import IArtistTrack from "./Interfaces/IArtistTrack";
import IYoutubeResponse from "./Interfaces/Youtube/IYoutubeResponse";
import IDeezerResponse from "./Interfaces/Deezer/IDeezerResponse";
import ISpotifyResponse from "./Interfaces/Spotify/ISpotifyResponse";

export async function createUrlCardForState(foundItem: ISpotifyItem | IYoutubeItem | IDeezerItem, service: Services) {
    const artistTrack = await getArtistTrackInItem(service, foundItem);
    const card = {...artistTrack} as IUrlCard;
    let item : ISpotifyItem | IYoutubeItem | IDeezerItem;
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
    let response : IYoutubeResponse | ISpotifyResponse | IDeezerResponse;

    if (requestedObject) {
        if (requestedObject.youtube) {
            response = {...requestedObject.youtube};
            forCreateCard = searchInYoutubeObject(response, artistTrack);
            objectForState.youtube = await createUrlCardForState(forCreateCard, Services.YOUTUBE);
        }
        if (requestedObject.spotify) {
            response = {...requestedObject.spotify};
            forCreateCard = searchInSpotifyObject(response, artistTrack);
            objectForState.spotify = await createUrlCardForState(forCreateCard, Services.SPOTIFY);
        }
        if (requestedObject.deezer) {
            response = {...requestedObject.deezer};
            forCreateCard = searchInDeezerObject(response, artistTrack);
            objectForState.deezer = await createUrlCardForState(forCreateCard, Services.DEEZER);
        }
        return objectForState;
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

/*
export async function searchById(request: IToCompare) {
    const {id, service} = request;
    const searchResult = await byId(service,request);
    const artistTrack = await getArtistTrackInResponse(service, )
    return await createObjectForState(artistTrack, searchResult);
}
*/
