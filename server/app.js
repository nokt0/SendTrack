const req = require('./requestModules');
const search = require('./searchModule');
const C = require('./consts');

async function createUrlCardForState(requestedObject, service) {
  let artistTrack = await search.getArtistTrack({requestedObject:requestedObject, service:service});
  let searchedItem;
  let card = {...artistTrack};
  let {youtube,spotify,deezer} = requestedObject;
  switch (service) {
    case C.YOUTUBE:
      card.url = 'https://www.youtube.com/watch?v=' + youtube.id.videoId;
      card.albumArt = youtube.snippet.thumbnails.medium.url;
      break;
    case C.SPOTIFY:
      card.url = spotify.album.external_urls.spotify;
      card.albumArt = spotify.album.images[1].url;
      card.bigAlbumArt = spotify.album.images[0].url;
      break;
    case C.DEEZER:
      card.url = deezer.link;
      card.albumArt = deezer.album.cover_medium;
      break;
  }
  return card;
}
//ДОБАВИТЬ РАБОТУ С ID
async function createObjectForState(artistTrack, requestedObject) {
  let {youtube, spotify, deezer} = requestedObject;
  let objectForState = {};
  let forCreateCard;

  if (requestedObject) {
    if (requestedObject.youtube) {
      objectForState.youtube = search.searchInYoutubeObject(youtube, artistTrack);
      forCreateCard = {
        requestedObject: {
          youtube:youtube
        },
        service: C.YOUTUBE
      };
      objectForState.youtube = await createUrlCardForState(objectForState,C.YOUTUBE);
    }
    if (requestedObject.spotify) {
      objectForState.spotify = search.searchInSpotifyObject(spotify, artistTrack);
      forCreateCard = {
        requestedObject: {
          spotify:spotify
        },
        service:C.SPOTIFY
      };
      objectForState.spotify = await createUrlCardForState(objectForState,C.SPOTIFY);
    }
    if (requestedObject.deezer) {
      objectForState.deezer = search.searchInDeezerObject(deezer, artistTrack);
      forCreateCard = {
        requestedObject: {
          deezer:deezer
        },
        service: C.DEEZER
      };
      objectForState.deezer =  await createUrlCardForState(objectForState,C.DEEZER);
    }
    return objectForState;
  }
}

async function searchEverywhere(artistTrackId) {
  let {artist, track} = artistTrackId;
  try {
    artist = search.eraseExcess(artist);
    track = search.eraseExcess(track);
    const searchResult = await search.everywhere(artistTrackId);
    return await createObjectForState(artistTrackId, searchResult);
  } catch (e) {
    console.error(e);
  }
}

async function searchById(request){
  const {id,service} = request;
  let artist;
  let track;
  const searchResult = await search.byId({id:id,service:service});
  const artistTrack = await search.getArtistTrack({requestedObject:searchResult.spotify})
  return await createObjectForState(artistTrack, searchResult);
}

exports.req = req;
exports.search = search;
exports.searchEverywhere = searchEverywhere;
exports.searchById = searchById;
