import { CryptoCoin } from '../Models/CryptoCoin'
import { User } from '../Models/User'

export interface ICryptocoinUseCase {
    registerUser(user: User): Promise<User>
    login(userName: string, password: string): Promise<string>
    getCryptoCurrencies(preferredCurrency: string): Promise<CryptoCoin[]>
    getUserCurrencies(limit: number, userId: string, order: string): Promise<CryptoCoin[]>
    addCryptocoinToUser(cryptocoinId: string, userId: string): Promise<void>
}
