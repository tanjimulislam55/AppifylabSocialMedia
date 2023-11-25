import { Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Column, Index } from 'typeorm'

@Entity()
class User {
    @PrimaryGeneratedColumn()
    id: number

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    @Column()
    isSuperUser: boolean

    @Index({ unique: true })
    @Column()
    email: string

    @Column()
    password: string
}

export default User
