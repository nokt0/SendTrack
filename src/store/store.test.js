import {submitForm} from './actions';
import C from '../constants';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

const spotifyLinks = ['https://open.spotify.com/track/3oXtfvECvS9fJPhLisiJ0A'];
const deezerLinks = ['https://www.deezer.com/track/913551682?utm_source=deezer&utm_content=track-913551682&utm_term=1715826122_1585604040&utm_medium=web'];
const youtubeLinks = ['https://www.youtube.com/watch?v=Ov66aRdwXKQ'];
const youtubeMusicLinks = ['https://music.youtube.com/watch?v=Ov66aRdwXKQ&feature=share'];
const artistTrackArray = ['Infant Annihilator - Plaguebearer'];

const middlewares = [thunk];
const mockStore = configureMockStore();
const store = mockStore(middlewares);

it('Get Service and Id object Spotify', () => {
  store.dispatch(submitForm(spotifyLinks[0]));

  expect(store.getActions().toMatchSnapshot());


});
