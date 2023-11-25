import { Request, Response } from 'express'

import { postRepository, commentRepository } from '../entities'
import User from '../entities/User'

interface AuthenticatedRequest extends Request {
    user: User
}

export const createComment = async (req: Request, res: Response): Promise<void> => {
    try {
        const post = await postRepository.findOneBy({ id: parseInt(req.params.postID) })
        if (!post) {
            res.status(404).json({ message: 'Post not found' })
            return
        }
        const comment = commentRepository.create({ ...req.body, totalReactions: 0, totalReplies: 0 })
        const results = await commentRepository.save(comment)
        await postRepository.update(parseInt(req.params.postID), {
            totalComments: () => 'totalComments + 1',
        })
        res.status(201).json(results)
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Server Error' })
    }
}

export const getCommentsByPostID = async (req: Request, res: Response): Promise<void> => {
    const offset: number = parseInt(req.query.offset as string, 10) || 1
    const limit: number = parseInt(req.query.limit as string, 10) || 5
    const skip = (offset - 1) * limit
    try {
        if (!req.params.postID) {
            res.status(400).json({ message: 'Post id is required.' })
            return
        }
        const comments = await commentRepository.find({
            where: { postID: parseInt(req.params.postID) },
            skip: skip,
            take: limit,
        })
        res.status(200).json(comments)
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Server Error' })
    }
}

export const updateComment = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = parseInt(req.params.id)
        const comment = await commentRepository.findOneBy({ id: id })
        if (comment) {
            if (comment.commentUserID !== parseInt(req.params.userID)) {
                res.status(403).json('User is only permitted to edit their own comment.')
                return
            }
            const { commentText } = req.body
            await commentRepository.update(id, { commentText })
            res.status(200).json({ id: comment.id, ...req.body })
        } else res.status(404).json({ message: 'Comment not found.' })
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Server Error' })
    }
}

export const deleteComment = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = parseInt(req.params.id)
        const comment = await commentRepository.findOneBy({ id: id })
        if (comment) {
            if (comment.commentUserID !== parseInt(req.params.userID)) {
                res.status(403).json('User is only permitted to delete their own comment.')
                return
            }
            await postRepository.update(parseInt(req.params.postID), {
                totalComments: () => `totalComments - ${1 + comment.totalReplies}`,
            })
            await commentRepository.delete(comment.id)
            // const post = await postRepository.findOneBy({ id: comment.postID })
            // if (post) {
            //     post.totalComments -= 1 + comment.totalReplies
            //     await postRepository.save(post)
            // }
            res.status(202).json(`Comment has been deleted`)
        } else res.status(404).json({ message: 'Comment not found' })
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Server Error' })
    }
}
