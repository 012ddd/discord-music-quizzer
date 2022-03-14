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

    async getPlaylist(id: string) {
        const offset = Math.random() * (700 - 0) + 0

        const result = await this.client.getPlaylistTracks(id,{
            offset: offset
        })

        console.log(result.body.items.length)

        return result.body.items.map(({ track }) => track)
    }
}
