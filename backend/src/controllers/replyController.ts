import { Request, Response } from 'express'

import { postRepository, commentRepository, replyRepository } from '../entities'
import User from '../entities/User'

interface AuthenticatedRequest extends Request {
    user: User
}

export const createReply = async (req: Request, res: Response): Promise<void> => {
    try {
        const comment = await commentRepository.findOneBy({ id: parseInt(req.params.commentID) })
        if (!comment) {
            res.status(404).json({ message: 'Comment not found' })
            return
        }
        const reply = replyRepository.create({ ...req.body, totalReactions: 0, totalReplies: 0 })
        const results = await replyRepository.save(reply)
        await postRepository.update(parseInt(req.params.postID), {
            totalComments: () => 'totalComments + 1',
        })
        await commentRepository.update(parseInt(req.params.commentID), {
            totalReplies: () => 'totalReplies + 1',
        })
        res.status(201).json(results)
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Server Error' })
    }
}

export const getRepliesByCommentID = async (req: Request, res: Response): Promise<void> => {
    const offset: number = parseInt(req.query.offset as string, 10) || 1
    const limit: number = parseInt(req.query.limit as string, 10) || 5
    const skip = (offset - 1) * limit
    try {
        if (!req.params.commentID) {
            res.status(400).json({ message: 'Comment id is required.' })
            return
        }
        const replies = await replyRepository.find({
            where: { commentID: parseInt(req.params.commentID) },
            skip: skip,
            take: limit,
        })
        res.status(200).json(replies)
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Server Error' })
    }
}

export const updateReply = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = parseInt(req.params.id)
        const reply = await replyRepository.findOneBy({ id: id })
        if (reply) {
            if (reply.replyUserID !== parseInt(req.params.userID)) {
                res.status(403).json('User is only permitted to edit their own reply.')
                return
            }
            const { replyText } = req.body
            await replyRepository.update(id, { replyText })
            res.status(200).json({ id: reply.id, ...req.body })
        } else res.status(404).json({ message: 'Reply not found.' })
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Server Error' })
    }
}

export const deleteReply = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = parseInt(req.params.id)
        const reply = await replyRepository.findOneBy({ id: id })
        if (reply) {
            if (reply.replyUserID !== parseInt(req.params.userID)) {
                res.status(403).json('User is only permitted to delete their own reply.')
                return
            }
            await postRepository.update(parseInt(req.params.postID), {
                totalComments: () => 'totalComments - 1',
            })
            await commentRepository.update(parseInt(req.params.commentID), {
                totalReplies: () => 'totalReplies - 1',
            })
            await replyRepository.delete(reply.id)
            // const post = await postRepository.findOneBy({ id: comment.postID })
            // if (post) {
            //     post.totalComments -= 1
            //     await postRepository.save(post)
            // }
            res.status(202).json(`Reply has been deleted`)
        } else res.status(404).json({ message: 'Reply not found' })
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Server Error' })
    }
}
