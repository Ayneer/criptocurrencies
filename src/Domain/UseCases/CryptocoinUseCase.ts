import { CryptoCoin } from '../../Models/CryptoCoin'
import { User } from '../../Models/User'
import { IAuth } from '../../Interfaces/IAuth'
import { IDatabase } from '../../Interfaces/IDatabase'
import { ICryptocoinUseCase } from '../../Interfaces/ICryptocoinUseCase'
import { inject, injectable } from 'inversify'
import { TYPES } from '../../IOC/types'
import { ICryptocoinService } from '../../Interfaces/ICryptocoinService'
import 'reflect-metadata'
import { CryptocoinError } from '../../Models/CryptocoinError'
import { ErrorType } from '../../Models/ErrorType'

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
        throw new CryptocoinError(ErrorType.EXISTING_USER, null)
    }

    async login(userName: string, password: string): Promise<string> {
        const user = await this.database.getUserByUserName(userName)
        if (user) {
            if (await this.auth.isValidPassword(password, user.password)) {
                return this.auth.getNewToken(user)
            } else {
                throw new CryptocoinError(ErrorType.INVALID_CREDENTIALS, null)
            }
        }
        throw new CryptocoinError(ErrorType.INVALID_CREDENTIALS, null)
    }

    async getCryptocoins(preferredCurrency: string): Promise<CryptoCoin[]> {
        return (await this.cryptocoinService.getCryptocoinsList(preferredCurrency))
            .sort((a, b) => a.price < b.price ? 1 : -1)
    }

    async getUserCryptocoins(limit: number, userId: string, order: string = 'desc'): Promise<CryptoCoin[]> {
        const user = await this.database.getUser(userId)
        if (user) {
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
        } else {
            throw new CryptocoinError(ErrorType.USER_NOT_FOUND, null)
        }
    }

    async addCryptocoinToUser(cryptocoinId: string, userId: string): Promise<void> {
        const user = await this.database.getUser(userId)
        if (user) {
            if (user.cryptoCoins.some(coin => coin.id === cryptocoinId)) {
                throw new CryptocoinError(ErrorType.CRYPTOCOIN_DUPLICATED, null)
            }
            const cryptocoin = await this.cryptocoinService.getUserCryptocoins(user.preferredCurrency, [cryptocoinId])
            if (cryptocoin && cryptocoin.length > 0) {
                user.cryptoCoins.push(cryptocoin[0])
                await this.database.updateUser(user)
            }
        } else {
            throw new CryptocoinError(ErrorType.USER_NOT_FOUND, null)
        }
    }
}
