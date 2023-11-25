import { Router } from 'express'

import { createPostReaction, createCommentReaction, createReplyReaction, getReactionsById, updateReaction, deleteReaction } from '../controllers/reactionController'
import { getAuthenticatedUser } from '../middlewares/auth'

const router = Router()

router.post('/post', getAuthenticatedUser, createPostReaction)
router.post('/comment', getAuthenticatedUser, createCommentReaction)
router.post('/reply', getAuthenticatedUser, createReplyReaction)
router.get('/:id', getReactionsById)
router.put('/:id', getAuthenticatedUser, updateReaction)
router.delete('/:id', getAuthenticatedUser, deleteReaction)

export default router
