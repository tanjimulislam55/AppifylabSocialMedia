import { Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Column, Index } from 'typeorm'

@Entity()
@Index(['ownerID'])
class Notification {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ nullable: false })
    actionCreator: number

    @Column({ nullable: false })
    ownerID: number

    @Column({ nullable: false })
    postID: number

    @Column()
    commentID: number

    @Column()
    replyID: number

    @Column({ nullable: false })
    notificationType: string

    @Column({ nullable: false })
    notificationDate: string

    @Column({ default: false })
    isSeen: boolean

    @Column({ default: false })
    isDetailSeen: boolean

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}

export default Notification
