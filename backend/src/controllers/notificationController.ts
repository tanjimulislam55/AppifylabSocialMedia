import { Request, Response } from 'express'

import { notificationRepository } from '../entities'
import User from '../entities/User'

interface AuthenticatedRequest extends Request {
    user: User
}

export const getNotificationsByUser = async (req: Request, res: Response): Promise<void> => {
    const offset: number = parseInt(req.query.offset as string, 10) || 1
    const limit: number = parseInt(req.query.limit as string, 10) || 5
    const skip = (offset - 1) * limit
    try {
        const notifications = await notificationRepository.find({
            where: { ownerID: parseInt(req.params.userID) },
            skip: skip,
            take: limit,
        })
        res.status(200).json(notifications)
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Server Error' })
    }
}

export const updateNotificationAsSeen = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = parseInt(req.params.id)
        const notification = await notificationRepository.findOneBy({ id: id })
        if (notification) {
            if (notification.ownerID !== parseInt(req.params.userID)) {
                res.status(403).json('User is only permitted to edit their own notification.')
                return
            }
            await notificationRepository.update(id, { isSeen: true })
            res.status(200).json({ id: notification.id, ...req.body })
        } else res.status(404).json({ message: 'Notification not found' })
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Server Error' })
    }
}

export const updateNotificationAsDetailSeen = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = parseInt(req.params.id)
        const notification = await notificationRepository.findOneBy({ id: id })
        if (notification) {
            if (notification.ownerID !== parseInt(req.params.userID)) {
                res.status(403).json('User is only permitted to edit their own notification.')
                return
            }
            await notificationRepository.update(id, { isDetailSeen: true })
            res.status(200).json({ id: notification.id, ...req.body })
        } else res.status(404).json({ message: 'Notification not found' })
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Server Error' })
    }
}
