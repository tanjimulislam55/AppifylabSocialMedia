import Post from './Post'
import Comment from './Comment'
import Reply from './Reply'
import Reaction from './Reaction'
import Notification from './Notification'
import AppDataSource from '../ormconfig'
import User from './User'

export const postRepository = AppDataSource.getRepository(Post)
export const commentRepository = AppDataSource.getRepository(Comment)
export const replyRepository = AppDataSource.getRepository(Reply)
export const reactionRepository = AppDataSource.getRepository(Reaction)
export const notificationRepository = AppDataSource.getRepository(Notification)
export const userRepository = AppDataSource.getRepository(User)
