import { CryptoCoin } from '../Models/CryptoCoin'
import { User } from '../Models/User'

export interface ICryptocoinUseCase {
    registerUser(user: User): Promise<User>
    login(userName: string, password: string): Promise<string>
    getCryptoCurrencies(preferredCurrency: string): Promise<CryptoCoin[]>
    getUserCurrencies(limit: number): Promise<CryptoCoin[]>
    addCryptocoinToUser(cryptocoinId: string, userId: string): Promise<void>
    setPreferredCurrency(currency: CryptoCoin): Promise<void>
}
