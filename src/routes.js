import { Router } from "express";
import { searchForMusic } from "./musics/index.js";
import { stremmingAudio } from "./stream/index.js";

const router = Router()

router.get('/:trackId', async (req, res, next) => {
    try {
        const { trackId } = req.params
        const track = searchForMusic(trackId)
        await stremmingAudio(req, res, track.trackId)
    } catch (error) {
        next(error)
    }
})

export { router }

