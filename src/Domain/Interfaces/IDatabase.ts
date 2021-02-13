import { User } from './../Models/User'

export interface IDatabase {
    createUser(user: User): Promise<User>
    getUser(userId: string): Promise<User>
    getUserByName(userName: string): Promise<User>
    updateUser(user: User): Promise<User>
}