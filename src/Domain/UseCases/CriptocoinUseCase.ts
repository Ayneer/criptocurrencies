import { CriptoCoin } from '../../Models/CriptoCoin'
import { User } from '../../Models/User'
import { IAuth } from '../../Interfaces/IAuth'
import { IDatabase } from '../../Interfaces/IDatabase'
import { ICriptocoinUseCase } from '../../Interfaces/ICriptocoinUseCase'
import { inject, injectable } from 'inversify'
import { TYPES } from '../../IOC/types'
import { ICriptocoinService } from '../../Interfaces/ICriptocoinService'

@injectable()
export class CriptocoinUseCase implements ICriptocoinUseCase {

    private database: IDatabase
    private auth: IAuth
    private criptocoinService: ICriptocoinService

    constructor(@inject(TYPES.Database) database: IDatabase,
                @inject(TYPES.Auth) auth: IAuth,
                @inject(TYPES.CriptocoinService) criptocoinService: ICriptocoinService) {
        this.criptocoinService = criptocoinService
        this.database = database
        this.auth = auth
    }

    async registerUser(user: User): Promise<User> {
        const previousUser = await this.database.getUserByUserName(user.userName)
        if (!previousUser) {
            user.password = await this.auth.encodePassword(user.password)
            return this.database.createUser(user)
        }
        throw new Error('User already exists')
    }

    async login(userName: string, password: string): Promise<string> {
        const user = await this.database.getUserByUserName(userName)
        if (user) {
            if (await this.auth.isValidPassword(password, user.password)) {
                return this.auth.getNewToken(user)
            } else {
                throw new Error('Invalid user or password')
            }
        }
        throw new Error('Invalid user or password')
    }

    async getCriptoCurrencies(preferredCurrency: string): Promise<CriptoCoin[]> {
        return await this.criptocoinService.getCriptocoinsList(preferredCurrency)
    }

    async getUserCurrencies(limit: number): Promise<CriptoCoin[]> {
        return [new CriptoCoin('', '', '', '', '', new Date())]
    }

    async addCriptocoinToUser(criptocoinId: string, userId: string): Promise<void> {
        const user = await this.database.getUser(userId)
        const criptocoin = await this.criptocoinService.getUserCriptocoins(user.preferredCurrency, [criptocoinId])
        if (criptocoin && criptocoin.length > 0) {
            user.criptoCoins.push(criptocoin[0])
            await this.database.updateUser(user)
        }
    }

    async setPreferredCurrency(currency: CriptoCoin): Promise<void> {

    }
}
