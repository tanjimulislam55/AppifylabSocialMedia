import { Router } from 'express'

import { createPost, getPosts, getPostById, updatePost, deletePost } from '../controllers/postController'
import { getAuthenticatedUser } from '../middlewares/auth'

const router = Router()

router.post('/', getAuthenticatedUser, createPost)
router.get('/', getPosts)
router.get('/:id', getPostById)
router.put('/:id', getAuthenticatedUser, updatePost)
router.delete('/:id', getAuthenticatedUser, deletePost)

export default router
