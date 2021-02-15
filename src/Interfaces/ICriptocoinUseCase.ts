import { CriptoCoin } from '../Models/CriptoCoin'
import { User } from '../Models/User'

export interface ICriptocoinUseCase {
    registerUser(user: User): Promise<User>
    login(userName: string, password: string): Promise<string>
    getCriptoCurrencies(preferredCurrency: string): Promise<CriptoCoin[]>
    getUserCurrencies(limit: number): Promise<CriptoCoin[]>
    addCriptocoinToUser(criptocoinId: string, userId: string): Promise<void>
    setPreferredCurrency(currency: CriptoCoin): Promise<void>
}
