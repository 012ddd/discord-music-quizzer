import SpotifyApi from 'spotify-web-api-node'

export default class Spotify {
    client = new SpotifyApi({
        clientId: process.env.SPOTIFY_CLIENT_ID,
        clientSecret: process.env.SPOTIFY_CLIENT_SECRET
    })

    async authorize() {
        const response = await this.client.clientCredentialsGrant()

        this.client.setAccessToken(response.body.access_token)

    }

    async getPlaylistSize(id: string) {
        const result = await this.client.getPlaylist(id)
        return result.body.tracks.total
    }

    async getPlaylist(id: string, printToTextChannel?: Function) {
        let currentOffset = 0
        const itemsLimit = 100
        // first request
        //console.log('getPlaylistTracks fetching batches of ' + itemsLimit)
        let result = await this.client.getPlaylistTracks(id, {
            limit: itemsLimit,
            offset: currentOffset
        })
        // get tracks from request
        let tracks = result.body.items
        // keep getting tracks until entire playlist is obtained
        let count = 1;
        while (result.body.next !== null) {
            currentOffset += itemsLimit
            //console.log('getPlaylistTracks fetching more... ')
            result = await this.client.getPlaylistTracks(id, {
                limit: itemsLimit,
                offset: currentOffset
            })
            // concat new tracks from request
            tracks = tracks.concat(result.body.items)
            // print periodically to text channel, if set
            if (printToTextChannel && !(count++ % 4)) {
                printToTextChannel('still fetching... current size: ' + tracks.length)
            }
        }

        console.log('getPlaylistTracks finished, got number of tracks: ' + tracks.length);
        return tracks.map(({ track }) => track)
    }
}
