import fs from 'fs'
import { promisify } from 'util'
import { resolve } from 'path'
import { __dirname } from '../utils/util.js'
import { NotFound } from '../exeptions/NotFound.js'

const getStat = promisify(fs.stat)
const exists = promisify(fs.exists)

export const stremmingAudio = async (request, response, trackId = "") => {
    const filePath = resolve(__dirname, 'src', 'musics', trackId)

    const trackExists = await exists(filePath)
    if (!trackExists)
        throw new NotFound('TRACKID_NOT_FOUND')


    const stat = await getStat(filePath)

    const { range } = request.headers;
    const { size } = stat;
    const start = Number((range || '').replace(/bytes=/, '').split('-')[0]);
    const end = size - 1;
    const chunkSize = (end - start) + 1;

    response.set({
        'Content-Range': `bytes ${start}-${end}/${size}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunkSize,
        'Content-Type': 'audio/mp3'
    });

    response.status(206);

    const stream = fs.createReadStream(filePath)

    // stream the file
    return stream.pipe(response)
}
