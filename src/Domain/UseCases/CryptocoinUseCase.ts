import { CryptoCoin } from '../../Models/CryptoCoin'
import { User } from '../../Models/User'
import { IAuth } from '../../Interfaces/IAuth'
import { IDatabase } from '../../Interfaces/IDatabase'
import { ICryptocoinUseCase } from '../../Interfaces/ICryptocoinUseCase'
import { inject, injectable } from 'inversify'
import { TYPES } from '../../IOC/types'
import { ICryptocoinService } from '../../Interfaces/ICryptocoinService'

@injectable()
export class CryptocoinUseCase implements ICryptocoinUseCase {

    private database: IDatabase
    private auth: IAuth
    private cryptocoinService: ICryptocoinService

    constructor(@inject(TYPES.Database) database: IDatabase,
                @inject(TYPES.Auth) auth: IAuth,
                @inject(TYPES.CryptocoinService) cryptocoinService: ICryptocoinService) {
        this.cryptocoinService = cryptocoinService
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

    async getCryptoCurrencies(preferredCurrency: string): Promise<CryptoCoin[]> {
        return (await this.cryptocoinService.getCryptocoinsList(preferredCurrency))
            .sort((a, b) => a.price < b.price ? 1 : -1)
    }

    async getUserCurrencies(limit: number, userId: string, order: string = 'desc'): Promise<CryptoCoin[]> {
        const user = await this.database.getUser(userId)
        const userCryptocoins = user.cryptoCoins.map(cryptocoin => cryptocoin.id)
        const cryptocoins = await this.cryptocoinService.getUserCryptocoins(user.preferredCurrency,
            userCryptocoins)
        user.cryptoCoins = cryptocoins
        this.database.updateUser(user)
        return cryptocoins
            .sort((a, b) => {
                return order === 'asc' ?
                    a.price > b.price ? 1 : -1 :
                    a.price < b.price ? 1 : -1
            })
            .slice(0, limit)
    }

    async addCryptocoinToUser(cryptocoinId: string, userId: string): Promise<void> {
        const user = await this.database.getUser(userId)
        if (user.cryptoCoins.some(coin => coin.id === cryptocoinId)) {
            throw new Error('The cryptocoin already was added')
        }
        const cryptocoin = await this.cryptocoinService.getUserCryptocoins(user.preferredCurrency, [cryptocoinId])
        if (cryptocoin && cryptocoin.length > 0) {
            user.cryptoCoins.push(cryptocoin[0])
            await this.database.updateUser(user)
        }
    }
}
