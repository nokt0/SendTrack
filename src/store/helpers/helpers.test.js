import {getServiceId, getArtistTrack} from './urlWorker.js';
import C from '../../constants';

const spotifyLinks = ['https://open.spotify.com/track/3oXtfvECvS9fJPhLisiJ0A'];
const deezerLinks = ['https://www.deezer.com/track/913551682?utm_source=deezer&utm_content=track-913551682&utm_term=1715826122_1585604040&utm_medium=web'];
const youtubeLinks =['https://www.youtube.com/watch?v=Ov66aRdwXKQ'];
const youtubeMusicLinks = ['https://music.youtube.com/watch?v=Ov66aRdwXKQ&feature=share'];
const artistTrackArray = ['Infant Annihilator - Plaguebearer'];

it('Get Service and Id object Spotify', () => {
  expect(getServiceId(spotifyLinks[0])).toEqual({
    service: C.requestService.SPOTIFY,
    id: '3oXtfvECvS9fJPhLisiJ0A',
  });
});

it('Get Service and Id object Deezer', () => {
  expect(getServiceId(deezerLinks[0])).toEqual({
    service: C.requestService.DEEZER,
    id: '913551682',
  });
});

it('Get Service and Id object Youtube', () => {
  expect(getServiceId(youtubeLinks[0])).toEqual({
    service: C.requestService.YOUTUBE,
    id: 'Ov66aRdwXKQ',
  });
});

it('Get Service and Id object Youtube Music', () => {
  expect(getServiceId(youtubeMusicLinks[0])).toEqual({
    service: C.requestService.YOUTUBE_MUSIC,
    id: 'Ov66aRdwXKQ',
  });
});

it('Get Artist Track', () => {
  expect(getArtistTrack(artistTrackArray[0])).toEqual({
    artist: 'Infant Annihilator',
    track: 'Plaguebearer',
  });
});

