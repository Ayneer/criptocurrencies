import { CriptoCoin } from '../../Models/CriptoCoin'
import { User } from '../../Models/User'
import { IAuth } from '../../Interfaces/IAuth'
import { IDatabase } from '../../Interfaces/IDatabase'
import { ICriptoCurrenciesUseCase } from '../../Interfaces/ICriptoCurrenciesUseCase'
import { inject, injectable } from 'inversify'
import { TYPES } from '../../IOC/types'

@injectable()
export class CriptoCurrenciesUseCase implements ICriptoCurrenciesUseCase {

    private database: IDatabase
    private auth: IAuth

    constructor(@inject(TYPES.Database) database: IDatabase,
                @inject(TYPES.Auth) auth: IAuth) {
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

    async getCriptoCurrencies(): Promise<CriptoCoin[]> {
        return [new CriptoCoin('', '', '', '', '', new Date())]
    }

    async getUserCurrencies(limit: number): Promise<CriptoCoin[]> {
        return [new CriptoCoin('', '', '', '', '', new Date())]
    }

    async addCurrencyToUser(currency: CriptoCoin): Promise<void> {

    }

    async setPreferredCurrency(currency: CriptoCoin): Promise<void> {

    }
}
