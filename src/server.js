import express from 'express'
import { router } from './routes.js'

const server = express()

server.use(express.json())

server.use(router)

server.use((error, req, res, next) => {
    const { message = '', code = 500 } = error
    return res.status(code).json({ message })
})

server.listen(5053);
