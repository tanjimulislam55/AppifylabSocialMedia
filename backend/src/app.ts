import express, { Request, Response } from 'express'
import { createServer } from 'http'
import helmet from 'helmet'
import cors from 'cors'
import 'reflect-metadata'
require('dotenv').config()

import postRoutes from './routes/postRoutes'
import commentRoutes from './routes/commentRoutes'
import replyRoutes from './routes/replyRoutes'
import reactionRoutes from './routes/reactionRoutes'
import userRoutes from './routes/userRoutes'
import AppDataSource from './ormconfig'
import { initializeSocketIO } from './socketio'

const app = express()
const httpServer = createServer(app)
initializeSocketIO(httpServer)

// middlewares
app.use(helmet())
app.use(cors<Request>())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// routes
app.use('/posts', postRoutes)
app.use('/comments', commentRoutes)
app.use('/replies', replyRoutes)
app.use('/reactions', reactionRoutes)
app.use('/users', userRoutes)

// root
app.get('/', async (_req: Request, res: Response) => {
    res.json({ message: 'welcome!' })
})

const PORT = process.env.PORT || 5000

AppDataSource.initialize()
    .then(() => {
        console.log('Connected to database')
        httpServer.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`)
        })
        console.log('Data Source has been initialized!')
    })
    .catch((err) => {
        console.error('Error during Data Source initialization', err)
    })
