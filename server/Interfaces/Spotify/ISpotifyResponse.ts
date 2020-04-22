import ISpotifyItem from "./ISpotifyItem";

export default interface ISpotifyResponse {
        tracks: {
            items: ISpotifyItem[]
    }
}
