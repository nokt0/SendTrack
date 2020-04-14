export default interface IYoutubeItem {
    id: { videoId: string },
    snippet: {
        thumbnails:
            {
                medium: {
                    url: string
                }
            },
        channelTitle:string,
        title:string,
    }
}
