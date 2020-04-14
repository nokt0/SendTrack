export default interface IDeezerItem {
    link:string,
    album:{
        cover_medium:string
    },
    type:string,
    title:string
    artist:{
        name:string
    }
}
