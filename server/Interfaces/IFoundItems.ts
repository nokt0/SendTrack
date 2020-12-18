import IYoutubeItem from "./Youtube/IYoutubeItem";
import ISpotifyItem from "./Spotify/ISpotifyItem";
import IDeezerItem from "./Deezer/IDeezerItem";

export default interface IFoundItems {
    youtube?: IYoutubeItem,
    spotify?: ISpotifyItem,
    deezer?: IDeezerItem
}
