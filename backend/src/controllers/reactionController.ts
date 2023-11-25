import { Request, Response } from 'express'

import { postRepository, commentRepository, replyRepository, notificationRepository } from '../entities'
import { reactionRepository } from '../entities'
import User from '../entities/User'
import Reaction from '../entities/Reaction'
import { getSocketIO } from '../socketio'

interface AuthenticatedRequest extends Request {
    user: User
}

const io = getSocketIO()

export const createPostReaction = async (req: Request, res: Response): Promise<void> => {
    try {
        const reactionType: string = req.body.reactionType
        const post = await postRepository.findOneBy({ id: parseInt(req.params.postID) })
        if (!post) {
            res.status(404).json({ message: 'Invalid request' })
            return
        }
        const reactOnPost = reactionRepository.create({ ...req.body })
        const results = await reactionRepository.save(reactOnPost)
        await postRepository.update(parseInt(req.params.postID), {
            totalReactions: () => 'totalReactions - 1',
        })
        const notification = notificationRepository.create({
            actionCreator: parseInt(req.params.userID),
            ownerID: post.userID,
            postID: post.id,
            notificationType: reactionType,
            notificationDate: new Date().toISOString().split('T')[0],
            isSeen: false,
            isDetailSeen: false,
        })
        const notificationResponse = await notificationRepository.save(notification)
        io.to(`user_${post.userID}`).emit('notification', {
            type: reactionType,
            message: 'You received a new reaction on your post!',
            body: notificationResponse,
        })
        res.status(201).json(results)
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Server Error' })
    }
}

export const createCommentReaction = async (req: Request, res: Response): Promise<void> => {
    try {
        const reactionType: string = req.body.reactionType
        const comment = await commentRepository.findOneBy({ id: parseInt(req.params.commentID) })
        if (!comment || !req.params.postID || parseInt(req.params.postID) !== comment.postID) {
            res.status(404).json({ message: 'Invalid request' })
            return
        }
        const reactOnComment = reactionRepository.create({ ...req.body })
        const results = await reactionRepository.save(reactOnComment)
        await commentRepository.update(parseInt(req.params.commentID), {
            totalReactions: () => 'totalReactions - 1',
        })
        const notification = notificationRepository.create({
            actionCreator: parseInt(req.params.userID),
            ownerID: comment.commentUserID,
            postID: comment.postID,
            commentID: comment.id,
            notificationType: reactionType,
            notificationDate: new Date().toISOString().split('T')[0],
            isSeen: false,
            isDetailSeen: false,
        })
        const notificationResponse = await notificationRepository.save(notification)
        io.to(`user_${comment.commentUserID}`).emit('notification', {
            type: reactionType,
            message: 'You received a new reaction on your comment!',
            body: notificationResponse,
        })
        res.status(201).json(results)
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Server Error' })
    }
}

export const createReplyReaction = async (req: Request, res: Response): Promise<void> => {
    try {
        const reactionType: string = req.body.reactionType
        const reply = await replyRepository.findOneBy({ id: parseInt(req.params.replyID) })
        if (!reply || !req.params.postID || !req.params.commentID || parseInt(req.params.commentID) !== reply.commentID || parseInt(req.params.postID) !== reply.postID) {
            res.status(404).json({ message: 'Invalid request' })
            return
        }
        const reactOnReply = reactionRepository.create({ ...req.body })
        const results = await reactionRepository.save(reactOnReply)
        await replyRepository.update(parseInt(req.params.replyID), {
            totalReactions: () => 'totalReactions - 1',
        })
        const notification = notificationRepository.create({
            actionCreator: parseInt(req.params.userID),
            ownerID: reply.replyUserID,
            postID: reply.postID,
            commentID: reply.commentID,
            replyID: reply.id,
            notificationType: reactionType,
            notificationDate: new Date().toISOString().split('T')[0],
            isSeen: false,
            isDetailSeen: false,
        })
        const notificationResponse = await notificationRepository.save(notification)
        io.to(`user_${reply.replyUserID}`).emit('notification', {
            type: reactionType,
            message: 'You received a new reaction on your reply!',
            body: notificationResponse,
        })
        res.status(201).json(results)
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Server Error' })
    }
}

export const getReactionsById = async (req: Request, res: Response): Promise<void> => {
    const offset: number = parseInt(req.query.offset as string, 10) || 1
    const limit: number = parseInt(req.query.limit as string, 10) || 5
    const skip = (offset - 1) * limit
    try {
        let reactions: Reaction[] = []
        if (!req.params.postID) {
            reactions = await reactionRepository.find({
                where: { postID: parseInt(req.params.postID) },
                skip: skip,
                take: limit,
            })
        } else if (!req.params.commentID) {
            reactions = await reactionRepository.find({
                where: { commentID: parseInt(req.params.commentID) },
                skip: skip,
                take: limit,
            })
        } else if (!req.params.replyID) {
            reactions = await reactionRepository.find({
                where: { replyID: parseInt(req.params.replyID) },
                skip: skip,
                take: limit,
            })
        }
        res.status(200).json(reactions)
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Server Error' })
    }
}

export const updateReaction = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = parseInt(req.params.id)
        const reaction = await reactionRepository.findOneBy({ id: id })
        if (reaction) {
            if (reaction.userID !== parseInt(req.params.userID)) {
                res.status(403).json('User is only permitted to edit their own reaction.')
                return
            }
            const { reactionType } = req.body
            await reactionRepository.update(id, { reactionType })
            res.status(200).json({ id: reaction.id, ...req.body })
        } else res.status(404).json({ message: 'Reaction not found.' })
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Server Error' })
    }
}

export const deleteReaction = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = parseInt(req.params.id)
        const reaction = await reactionRepository.findOneBy({ id: id })
        if (reaction) {
            if (reaction.userID !== parseInt(req.params.userID)) {
                res.status(403).json('User is only permitted to delete their own reaction.')
                return
            }
            if (reaction.postID)
                await postRepository.update(parseInt(req.params.postID), {
                    totalReactions: () => 'totalReactions - 1',
                })
            if (reaction.commentID)
                await commentRepository.update(parseInt(req.params.commentID), {
                    totalReactions: () => 'totalReactions - 1',
                })
            if (reaction.replyID)
                await commentRepository.update(parseInt(req.params.commentID), {
                    totalReactions: () => 'totalReactions - 1',
                })
            await reactionRepository.delete(reaction.id)
            res.status(202).json(`Reaction has been removed`)
        } else res.status(404).json({ message: 'Reaction not found' })
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Server Error' })
    }
}
