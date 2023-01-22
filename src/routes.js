import { Router } from "express";
import { searchForMusic, searchForTrack } from "./musics/index.js";
import { stremmingAudio } from "./stream/index.js";

const router = Router()

router.get('/:trackId', async (req, res, next) => {
    const { trackId } = req.params
    const track = searchForMusic(trackId)
    if (!track) {
        return res.status(404).send()
    }
    const { fileSize, stream } = await stremmingAudio(track.trackId)

    const { range } = req.headers;
    const size = fileSize;
    const start = Number((range || '').replace(/bytes=/, '').split('-')[0]);
    const end = size - 1;
    const chunkSize = (end - start) + 1;

    res.set({
        'Content-Range': `bytes ${start}-${end}/${size}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunkSize,
        'Content-Type': 'audio/mp3',
        'name': track.name,
        'author': track.author,
        'track-id': track.trackId,
    });

    res.status(206);

    return stream.pipe(res)
})

router.get('/track/list', (req, res, next) => {
    const tracks = searchForTrack()
    return res.status(200).json(tracks)
})

export { router }

