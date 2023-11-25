import { Router } from 'express'
import { signin, signup, getAllUsers } from '../controllers/userController'

const router = Router()

router.post('/signup', signup)
router.post('/signin', signin)
router.get('/', getAllUsers)

export default router
