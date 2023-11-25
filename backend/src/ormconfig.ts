import 'reflect-metadata'
import { DataSource } from 'typeorm'
require('dotenv').config()

import Post from './entities/Post'
import Reply from './entities/Reply'
import Comment from './entities/Comment'
import Notification from './entities/Notification'
import User from './entities/User'

const AppDataSource = new DataSource({
    type: 'mysql',
    host: process.env.DB_HOST,
    port: 3306,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: true,
    logging: true,
    entities: [Post, Reply, Comment, Notification, User],
    // migrations: ['.migrations/*.ts'],
})

export default AppDataSource
