import IYoutubeResponse from "./Youtube/IYoutubeResponse";
import ISpotifyResponse from "./Spotify/ISpotifyResponse";
import IDeezerResponse from "./Deezer/IDeezerResponse";

export default interface IResponse {
    youtube?: IYoutubeResponse,
    spotify?: ISpotifyResponse,
    deezer?: IDeezerResponse,
}
