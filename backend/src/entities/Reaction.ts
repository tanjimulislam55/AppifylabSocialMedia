import { Entity, Index, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Column, OneToMany, Unique } from 'typeorm'

@Entity()
@Index(['postID', 'commentID', 'replyID'])
class Reaction {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ nullable: false })
    userID: number

    @Column({ nullable: false })
    postID: number

    @Column()
    commentID: number

    @Column()
    replyID: number

    @Column({ nullable: false })
    reactionType: string

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}

export default Reaction
