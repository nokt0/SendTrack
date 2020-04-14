import {Services} from './cnst'
import {eraseExcess} from './searchModules';
import IToCompare from './Interfaces/IToCompare';
import {} from './requestModules'
import {
    getArtistTrack,
    everywhere,
    byId,
    searchInDeezerObject,
    searchInYoutubeObject,
    searchInSpotifyObject
} from './searchModules'
import IResponse from "./Interfaces/IResponse";

export async function createUrlCardForState(requestedObject: IResponse, service: Services) {
    const artistTrack = await getArtistTrack({"service": service}, requestedObject);
    const card = {...artistTrack};
    const {youtube, spotify, deezer} = requestedObject;
    switch (service) {
        case Services.YOUTUBE:
            card.url = 'https://www.youtube.com/watch?v=' + youtube.id.videoId;
            card.albumArt = youtube.snippet.thumbnails.medium.url;
            break;
        case Services.SPOTIFY:
            card.url = spotify.album.external_urls.spotify;
            card.albumArt = spotify.album.images[1].url;
            card.bigAlbumArt = spotify.album.images[0].url;
            break;
        case Services.DEEZER:
            card.url = deezer.link;
            card.albumArt = deezer.album.cover_medium;
            break;
    }
    return card;
}

// ДОБАВИТЬ РАБОТУ С ID
export async function createObjectForState(artistTrack: IToCompare, requestedObject: IResponse) {
    const {youtube, spotify, deezer} = requestedObject;
    const objectForState: IResponse = {};
    let forCreateCard;

    if (requestedObject) {
        if (requestedObject.youtube) {
            objectForState.youtube = searchInYoutubeObject(youtube, artistTrack);
            forCreateCard = {
                requestedObject: {
                    "youtube": youtube
                },
                service: Services.YOUTUBE
            };
            objectForState.youtube = await createUrlCardForState(objectForState, Services.YOUTUBE);
        }
        if (requestedObject.spotify) {
            objectForState.spotify = searchInSpotifyObject(spotify, artistTrack);
            forCreateCard = {
                requestedObject: {
                    "spotify": spotify
                },
                service: Services.SPOTIFY
            };
            objectForState.spotify = await createUrlCardForState(objectForState, Services.SPOTIFY);
        }
        if (requestedObject.deezer) {
            objectForState.deezer = searchInDeezerObject(deezer, artistTrack);
            forCreateCard = {
                requestedObject: {
                    "deezer": deezer
                },
                service: Services.DEEZER
            };
            objectForState.deezer = await createUrlCardForState(objectForState, Services.DEEZER);
        }
        return objectForState;
    }
}

export async function searchEverywhere(artistTrackId: IToCompare) {
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

export async function searchById(request: IToCompare) {
    const {id, service} = request;
    let artist;
    let track;
    const searchResult = await byId({"id": id, "service": service});
    const artistTrack = await getArtistTrack({"requestedObject": searchResult.spotify})
    return await createObjectForState(artistTrack, searchResult);
}
