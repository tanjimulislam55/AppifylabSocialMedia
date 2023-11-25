import { Request, Response } from 'express'

import { userRepository } from '../entities'
import { comparePassword, createToken, encryptPassword, verifyToken } from '../utils/auth'

export const signup = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            res.status(403).json('Fields required for email and password')
            return
        }
        const existingUser = await userRepository.findOne({ where: { email: email } })
        if (existingUser) res.status(403).json('Email already in use')
        else {
            const hashedPassword = await encryptPassword(password)
            const user = userRepository.create({ email: email, password: hashedPassword, isSuperUser: false })
            const results = await userRepository.save(user)
            res.status(201).json(results)
        }
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Server Error' })
    }
}

export const signin = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            res.status(403).json('Fields required for email and password')
            return
        }
        const user = await userRepository.findOne({ where: { email: email } })
        if (!user) {
            res.status(404).json({ message: 'User not found' })
            return
        }

        const isVerified = await comparePassword(user.password, password)
        console.log(user.password, password, isVerified)
        if (!isVerified) {
            res.status(403).json({ message: 'Incorrect password' })
            return
        } else {
            const accessToken = createToken(user, 'ACCESS_TOKEN')
            const refreshToken = createToken(user, 'REFRESH_TOKEN')

            res.status(200)
                .cookie('token', accessToken, {
                    httpOnly: true,
                    sameSite: 'strict',
                    secure: true,
                })
                .cookie('refreshToken', refreshToken, {
                    httpOnly: true,
                    sameSite: 'strict',
                    secure: true,
                })
                .json({
                    id: user.id,
                    email: user.email,
                })
        }
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Server Error' })
    }
}

export const refreshAccessToken = async (req: Request, res: Response): Promise<void> => {
    try {
        const refreshToken = req.cookies.refreshToken

        if (!refreshToken) {
            res.status(401).json({ message: 'Refresh token not provided' })
            return
        }

        const tokenData = verifyToken(refreshToken, process.env.REFRESH_TOKEN_SECRET!)
        if (typeof tokenData === 'string') {
        } else {
            const { email } = tokenData

            const user = await userRepository.findOne({ where: { email: email } })
            if (!user) {
                res.status(404).json({
                    message: 'User not found',
                })
                return
            }
            const accessToken = createToken(user, 'ACCESS_TOKEN')

            res.status(200)
                .cookie('token', accessToken, {
                    httpOnly: true,
                    sameSite: 'strict',
                    secure: true,
                })
                .json({
                    id: user.id,
                    email: user.email,
                })
        }
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Server Error' })
    }
}

export const getAllUsers = async (_req: Request, res: Response): Promise<void> => {
    try {
        const users = await userRepository.find()
        res.status(200).json(users)
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Server Error' })
    }
}
