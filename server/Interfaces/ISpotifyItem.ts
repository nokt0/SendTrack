export default interface ISpotifyItem {
    name:string,
    album:{
        external_urls:{
            spotify:string
        }
        images:[]
    }
    artists:{name:string}[],
    type:string
}
