import { Router } from 'express'

import { createReply, getRepliesByCommentID, updateReply, deleteReply } from '../controllers/replyController'
import { getAuthenticatedUser } from '../middlewares/auth'

const router = Router()

router.post('/', getAuthenticatedUser, createReply)
router.get('/:id', getRepliesByCommentID)
router.put('/:id', getAuthenticatedUser, updateReply)
router.delete('/:id', getAuthenticatedUser, deleteReply)

export default router
