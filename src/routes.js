import { Router } from "express";
import { searchForMusic, searchForTrack } from "./musics/index.js";
import { stremmingAudio } from "./stream/index.js";

const router = Router()

router.get('/:trackId', async (req, res, next) => {
    try {
        const { trackId } = req.params
        const track = searchForMusic(trackId)
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
        });

        res.status(206);

        return stream.pipe(res)
    } catch (error) {
        next(error)
    }
})

router.get('/track/list', (req, res, next) => {
    try {
        const tracks = searchForTrack()
        return res.status(200).json(tracks)
    } catch (error) {

    }
})

export { router }

