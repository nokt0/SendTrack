import {Services} from "../const";
import IArtistTrack from "../Interfaces/IArtistTrack";
import ISpotifyItem from "../Interfaces/Spotify/ISpotifyItem";
import ISpotifySearch from "../Interfaces/Spotify/ISpotifySearch";
import IDeezerSearch from "../Interfaces/Deezer/IDeezerSearch";
import IYoutubeSearch from "../Interfaces/Youtube/IYoutubeSearch";

export default class NotFoundMatch extends Error {
    constructor(message: string, toCompare: IArtistTrack, response: ISpotifySearch | IDeezerSearch | IYoutubeSearch) {
        super(message);
        this.name = "NotFoundMatch";
        this.toCompare = toCompare;
    }

    toCompare: IArtistTrack;
    response: ISpotifySearch | IDeezerSearch | IYoutubeSearch;
}
