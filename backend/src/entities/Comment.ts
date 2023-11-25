import { Entity, Column, ManyToOne, OneToMany, JoinColumn, Unique, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm'

import Post from './Post'
import Reply from './Reply'

@Entity()
export class Comment {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ nullable: false })
    commentType: string

    @Column({ default: 0 })
    totalReactions: number

    @Column({ default: 0 })
    totalReplies: number

    @Column({ nullable: false })
    commentUserID: number

    @Column()
    commentText: string

    @Column({ nullable: false })
    postID: number

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    @OneToMany(() => Reply, (reply) => reply.comment, {
        cascade: true,
        lazy: true,
    })
    replies: Reply[]

    @ManyToOne(() => Post, (post) => post.comments)
    @JoinColumn({ name: 'postID' })
    post: Post
}

export default Comment
