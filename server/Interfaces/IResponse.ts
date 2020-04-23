import IYoutubeSearch from "./Youtube/IYoutubeSearch";
import ISpotifySearch from "./Spotify/ISpotifySearch";
import IDeezerSearch from "./Deezer/IDeezerSearch";
import IYoutubeItem from "./Youtube/IYoutubeItem";
import IDeezerItem from "./Deezer/IDeezerItem";
import ISpotifyItem from "./Spotify/ISpotifyItem";

export default interface IResponse {
    youtube?: IYoutubeSearch | IYoutubeItem,
    spotify?: ISpotifySearch | ISpotifyItem,
    deezer?: IDeezerSearch | IDeezerItem
}
