export default interface IDeezerItem {
    title_short: string;
    link:string,
    album:{
        cover_big: string;
        cover_medium:string
    },
    type:string,
    title:string
    artist:{
        name:string
    }
}
