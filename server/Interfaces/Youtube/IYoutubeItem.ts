export default interface IYoutubeItem {
    id: { videoId: string },
    snippet: {
        thumbnails:
            {
                high: { url: string },
                medium: { url: string }
            },
        channelTitle: string,
        title: string,
    }
}
