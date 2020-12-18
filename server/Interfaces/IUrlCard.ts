import IArtistTrack from "./IArtistTrack";

export default interface IUrlCard extends IArtistTrack{
    url:string,
    albumArt:string,
    bigAlbumArt:string
}
