import { CryptoCoin } from '../Models/CryptoCoin'

export interface ICryptocoinService {
    getCryptocoinsList(preferredCurrency: string): Promise<CryptoCoin[]>
    getUserCryptocoins(preferredCurrency: string, cryptocoins: string[]): Promise<CryptoCoin[]>
}
