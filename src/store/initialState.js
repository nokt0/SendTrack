import background from "../img/black-bkg.webp";

const initialState = {
    artist: '',
    track: '',
    url: '',
    background: background,
    isFetching: false,
    arrayOfUrls: {
        spotify: {
            artist: undefined,
            track: undefined,
            url: undefined,
            albumArt: undefined
        },
        youtube: {
            artist: undefined,
            track: undefined,
            url: undefined,
            albumArt: undefined
        },
        youtubeMusic: {
            artist: undefined,
            track: undefined,
            url: undefined,
            albumArt: undefined
        },
        deezer: {
            artist: undefined,
            track: undefined,
            url: undefined,
            albumArt: undefined
        }
    },
};

export default initialState;