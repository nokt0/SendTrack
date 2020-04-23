import ISpotifyItem from "./ISpotifyItem";

export default interface ISpotifySearch {
        tracks: {
            items: ISpotifyItem[]
    }
}
