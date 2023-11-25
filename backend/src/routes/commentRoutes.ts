import { Router } from 'express'

import { createComment, getCommentsByPostID, updateComment, deleteComment } from '../controllers/commentController'
import { getAuthenticatedUser } from '../middlewares/auth'

const router = Router()

router.post('/', getAuthenticatedUser, createComment)
router.get('/:id', getCommentsByPostID)
router.put('/:id', getAuthenticatedUser, updateComment)
router.delete('/:id', getAuthenticatedUser, deleteComment)

export default router
