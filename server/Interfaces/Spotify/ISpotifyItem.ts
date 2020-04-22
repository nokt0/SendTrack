export default interface ISpotifyItem {
    name: string,
    album: {
        external_urls: {
            spotify: string
        }
        images: [{ url: string }, { url: string }, { url: string }]
    }
    artists: { name: string }[],
    type: string
}
