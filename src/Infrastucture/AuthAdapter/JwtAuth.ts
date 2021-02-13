import { IConfig } from '../../Interfaces/IConfig'
import { User } from '../../Models/User'
import { IAuth } from '../../Interfaces/IAuth'
import jwt from 'jsonwebtoken'
import { inject, injectable } from 'inversify'
import { TYPES } from '../../IOC/types'
import bcrypt from 'bcrypt'

@injectable()
export class JwtAuth implements IAuth {

    private secret: string
    private userTokens: string[] = []
    private saltRounds: number = 10

    constructor(@inject(TYPES.Config) config: IConfig) {
        this.secret = config.secretToken
    }

    async encodePassword(password: string): Promise<string> {
        return bcrypt.hash(password, this.saltRounds)
    }

    async isValidPassword(password: string, hash: string): Promise<boolean> {
        return bcrypt.compare(password, hash)
    }

    getNewToken(user: User): string {
        const token = jwt.sign({ user }, this.secret)
        this.userTokens.push(token)
        return token
    }

    isValidToken(token: string): boolean {
        try {
            jwt.verify(token, this.secret)
            return this.userTokens.includes(token)
        } catch (error) {
            this.removeToken(token)
            return false
        }
    }

    removeToken(token: string): void {
        this.userTokens = this.userTokens.filter(curToken => curToken !== token)
    }

}
