import { Request, Response } from 'express'

import { postRepository } from '../entities'
import User from '../entities/User'

interface AuthenticatedRequest extends Request {
    user: User
}

export const createPost = async (req: Request, res: Response): Promise<void> => {
    try {
        const post = postRepository.create({ ...req.body, totalReactions: 0, totalComments: 0 })
        const results = await postRepository.save(post)
        res.status(201).json(results)
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Server Error' })
    }
}

export const getPosts = async (req: Request, res: Response): Promise<void> => {
    const offset: number = parseInt(req.query.offset as string, 10) || 1
    const limit: number = parseInt(req.query.limit as string, 10) || 5
    const skip = (offset - 1) * limit
    try {
        const posts = await postRepository.find({
            skip: skip,
            take: limit,
        })
        res.status(200).json(posts)
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Server Error' })
    }
}

export const getPostById = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = parseInt(req.params.id)
        const post = await postRepository.findOneBy({ id: id })
        await post?.comments
        if (post) res.status(200).json(post)
        else res.status(404).json({ message: 'Post not found' })
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Server Error' })
    }
}

export const updatePost = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = parseInt(req.params.id)
        const post = await postRepository.findOneBy({ id: id })
        if (post) {
            if (post.userID !== parseInt(req.params.userID)) {
                res.status(403).json('User is only permitted to edit their own post.')
                return
            }
            const { visiblity, postContent } = req.body
            await postRepository.update(id, { visiblity, postContent })
            res.status(200).json({ id: post.id, ...req.body })
        } else res.status(404).json({ message: 'Post not found' })
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Server Error' })
    }
}

export const deletePost = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = parseInt(req.params.id)
        const post = await postRepository.findOneBy({ id: id })
        if (post) {
            if (post.userID === parseInt(req.params.userID)) {
                await postRepository.delete(id)
                res.status(202).json(`Post has been deleted`)
            } else res.status(403).json('User is only permitted to delete their own post.')
        } else res.status(404).json({ message: 'Post not found' })
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Server Error' })
    }
}
