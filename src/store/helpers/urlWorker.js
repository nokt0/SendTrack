import C from '../../constants';

function determineService(url) {
  const services = [
    'music.youtube',
    'youtube',
    'spotify',
    'music.apple',
    'deezer',
  ];

  let editedUrl = url;

  if (url.indexOf('youtu.be/') !== -1) {
    editedUrl = 'https://www.youtube.com/watch?v=' + url.substring(url.indexOf('youtu.be/') + 'youtu.be/'.length, url.length);
  }

  let resultService = services.find((service)=>{
    return editedUrl.indexOf(service) !== -1;
  });

  const service = {...C.requestService};

  if (resultService) {
    switch (resultService) {
      case 'music.youtube':
        resultService = service.YOUTUBE_MUSIC;
        break;
      case 'youtube':
        resultService = service.YOUTUBE;
        break;
      case 'spotify':
        resultService = service.SPOTIFY;
        break;
      case 'deezer':
        resultService = service.DEEZER;
        break;
      case 'music.apple':
        resultService = service.APPLE_MUSIC;
        break;
    }
  }

  return resultService;
}

function eraseFeat(str) {
  let result = str;
  let index;
  if (str.indexOf(/feat/i) !== -1) {
    index = str.indexOf(/feat/i);
    result = str.substring(0, index);
  }

  return result;
}

function eraseYoutubeWatchArg(cutUrl) {
  const index = cutUrl.indexOf('watch?');
  return cutUrl.substring(index + 'watch?'.length);
}

export function getArtistTrack(artistTrackString) {
  let result = artistTrackString.split('-');
  result = result.map((str)=>{
    return str.trim();
  } );

  return {artist: result[0], track: result[1]};
}

export function createArtistTrackRequestUrl(artist, track) {
  const url = '/tracks/byName?artist=' + artist + '&track=' + track;
  return url;
}

export function createByIdRequest(id, service) {
  let srv;
  switch (service) {
    case C.requestService.YOUTUBE:
      srv = 'youtube';
      break;
    case C.requestService.SPOTIFY:
      srv = 'spotify';
      break;
    case C.requestService.DEEZER:
      srv = 'deezer';
      break;
  }
  const url = '/tracks/byId/' + srv + '?id=' + id;
  return url;
}

function determineId(url, service) {
  const srv = {...C.requestService};
  let id = url;
  let index;

  switch (service) {
    case srv.YOUTUBE:
      id = eraseYoutubeWatchArg(id);
      index = id.indexOf('v=') + 2;
      id = id.substring(index, id.length);
      index = id.indexOf('&');
      if (index !== -1) {
        id = id.substring(0, index);
      }
      break;
    case srv.YOUTUBE_MUSIC:
      id = eraseYoutubeWatchArg(id);
      index = id.indexOf('v=') + 2;
      id = id.substring(index, id.length);
      index = id.indexOf('&');
      if (index !== -1) {
        id = id.substring(0, index);
      }
      break;
    case srv.DEEZER:
      index = id.indexOf('track/');
      id = id.substring(index + 6, id.length);
      index = id.indexOf('?');
      id = id.substring(0, index);
      break;
    case srv.SPOTIFY:
      index = id.indexOf('track/');
      id = id.substring(index + 6, id.length);
      break;
  }

  return id;
}

export function getServiceId(url) {
  const service = determineService(url);
  const id = determineId(url, service);

  return {service, id};
}

export function isUrl(url) {
  let index;
  if (url.indexOf('.') !== -1) {
    index = url.indexOf('.');
  } else {
    return false;
  }

  index = url.indexOf('/', index);
  if (index !== -1) {
    return true;
  } else {
    return false;
  }
}

export function artistTrackFromString(str) {
  const splitted = str.split(/[-,—,–,−,-]/);
  if (splitted.length < 3) {
    return {artist: splitted[0], track: splitted[1]};
  }
}


