import fs from 'fs'
import { promisify } from 'util'
import { resolve } from 'path'
import { __dirname } from '../utils/util.js'
import { NotFound } from '../exeptions/NotFound.js'

const getStat = promisify(fs.stat)
const exists = promisify(fs.exists)

export const stremmingAudio = async (trackId = "") => {
    const filePath = resolve(__dirname, 'src', 'musics', trackId)

    const trackExists = await exists(filePath)

    if (!trackExists)
        throw new NotFound('TRACKID_NOT_FOUND')

    const stat = await getStat(filePath)
    const stream = fs.createReadStream(filePath)

    return {
        stream: stream,
        fileSize: stat.size
    }
}
