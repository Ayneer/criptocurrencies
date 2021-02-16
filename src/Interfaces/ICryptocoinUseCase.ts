import { CryptoCoin } from '../Models/CryptoCoin'
import { User } from '../Models/User'

export interface ICryptocoinUseCase {
    registerUser(user: User): Promise<User>
    login(userName: string, password: string): Promise<string>
    getCryptocoins(preferredCurrency: string): Promise<CryptoCoin[]>
    getUserCryptocoins(limit: number, userId: string, order: string): Promise<CryptoCoin[]>
    addCryptocoinToUser(cryptocoinId: string, userId: string): Promise<void>
}
