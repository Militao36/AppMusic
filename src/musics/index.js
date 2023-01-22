import { NotFound } from "../exeptions/NotFound.js"

const tracks = [
    {
        name: 'Não troco',
        author: 'Hungria',
        trackId: 'c8bd59cbd6a52e426e3742cf079412c8'
    }
]

export function searchForMusic(trackId) {
    if (trackId) {
        return null
    }
    const track = tracks
        .filter(value => value.trackId === trackId)

    if (!track || track.length === 0)
        throw new NotFound('TRACK_NOT_FOUND')

    return track[0]
}

export function searchForTrack() {
    return tracks
}