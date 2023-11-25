import { Entity, Column, ManyToOne, JoinColumn, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm'

import Comment from './Comment'

@Entity()
class Reply {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ nullable: false })
    replyType: string

    @Column({ default: 0 })
    totalReactions: number

    @Column({ nullable: false })
    replyUserID: number

    @Column()
    replyText: string

    @Column({ nullable: false })
    postID: number

    @Column({ nullable: false })
    commentID: number

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    @ManyToOne(() => Comment, (comment) => comment.replies)
    @JoinColumn({ name: 'commentID' })
    comment: Comment
}

export default Reply
