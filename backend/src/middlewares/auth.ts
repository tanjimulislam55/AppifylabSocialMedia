import { Request, Response, NextFunction } from 'express'
require('dotenv').config()

import { userRepository } from '../entities'
import User from '../entities/User'
import { verifyToken } from '../utils/auth'

export interface AuthenticatedRequest extends Request {
    user: User
}

export const getAuthenticatedUser = async (req: Request, res: Response, next: NextFunction) => {
    const authenticatedReq = req as AuthenticatedRequest
    const token = authenticatedReq.headers['authorization']?.split('Bearer ')[1]?.trim()
    if (!token) {
        return res.status(403).json({
            message: 'Could not validate credentials',
        })
    } else {
        try {
            const tokenData = verifyToken(token, process.env.SECRET_KEY!)
            if (typeof tokenData === 'string') {
            } else {
                const { email } = tokenData
                const user = await userRepository.findOne({ where: { email: email } })
                if (!user) {
                    return res.status(404).json({
                        message: 'User not found',
                    })
                } else {
                    authenticatedReq.user = user
                    next()
                }
            }
        } catch (error) {
            return res.status(403).json({
                message: 'Could not validate credentials',
            })
        }
    }
}

export const getAuthenticatedSuperUser = async (req: Request, res: Response, next: NextFunction) => {
    const authenticatedReq = req as AuthenticatedRequest
    const token = authenticatedReq.headers['authorization']?.split('Bearer ')[1]?.trim()
    if (!token) {
        return res.status(403).json({
            message: 'Could not validate credentials',
        })
    } else {
        try {
            const tokenData = verifyToken(token, process.env.SECRET_KEY!)
            if (typeof tokenData === 'string') {
            } else {
                const { email } = tokenData
                const user = await userRepository.findOne({ where: { email: email } })
                if (!user) {
                    return res.status(404).json({
                        message: 'User not found',
                    })
                } else {
                    if (user.isSuperUser === false)
                        return res.status(403).json({
                            message: 'User does not have enough priviledges',
                        })
                    authenticatedReq.user = user
                    next()
                }
            }
        } catch (error) {
            return res.status(403).json({
                message: 'Could not validate credentials',
            })
        }
    }
}
