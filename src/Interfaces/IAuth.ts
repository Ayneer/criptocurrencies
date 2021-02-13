import { User } from '../Models/User'

export interface IAuth {
    encodePassword(password: string): Promise<string>
    isValidPassword(password: string, hash: string): Promise<boolean>
    getNewToken(user: User): string
    isValidToken(token: string): boolean
    removeToken(token: string): void
}
