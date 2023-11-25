import { Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Column, OneToMany, Unique } from 'typeorm'

import Comment from './Comment'

@Entity()
class Post {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ nullable: false })
    visiblity: string

    @Column({ nullable: false })
    userID: number

    @Column({ nullable: false })
    postContentType: string

    @Column()
    postContent: string

    @Column({ default: 0 })
    totalReactions: number

    @Column({ default: 0 })
    totalComments: number

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    @OneToMany(() => Comment, (comment) => comment.post, {
        cascade: true,
        lazy: true,
    })
    comments: Promise<Comment[]>
}

export default Post
