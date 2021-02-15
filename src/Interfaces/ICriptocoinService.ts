import { CriptoCoin } from '../Models/CriptoCoin'

export interface ICriptocoinService {
    getCriptocoinsList(preferredCurrency: string): Promise<CriptoCoin[]>
    getUserCriptocoins(preferredCurrency: string, criptocoins: string[]): Promise<CriptoCoin[]>
}
