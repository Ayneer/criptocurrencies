import { User } from '../Models/User'

export interface IDatabase {
    createUser(user: User): Promise<User>
    getUser(userId: string): Promise<User | undefined>
    getUserByUserName(userName: string): Promise<User | undefined>
    updateUser(user: User): Promise<void>
}
