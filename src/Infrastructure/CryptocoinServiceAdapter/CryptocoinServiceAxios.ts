import { ICryptocoinService } from '../../Interfaces/ICryptocoinService'
import { inject, injectable } from 'inversify'
import axios, { AxiosResponse } from 'axios'
import { CryptoCoin } from '../../Models/CryptoCoin'
import { TYPES } from '../../IOC/types'
import { IConfig } from '../../Interfaces/IConfig'

@injectable()
export class CryptocoinServiceAxios implements ICryptocoinService {

    private cryptocoinUrl: string

    constructor(@inject(TYPES.Config) config: IConfig) {
        this.cryptocoinUrl = config.cryptocoinUrl
    }

    public async getCryptocoinsList(preferredCurrency: string): Promise<CryptoCoin[]> {
        const response: AxiosResponse = await axios.get(`${this.cryptocoinUrl}/coins/markets?vs_currency=${preferredCurrency}`)
        return this.getResponse(response)
    }

    public async getUserCryptocoins(preferredCurrency: string, cryptocoins: string[]): Promise<CryptoCoin[]> {
        const ids = cryptocoins.join(',')
        const response = await axios.get(`${this.cryptocoinUrl}/coins/markets?vs_currency=${preferredCurrency}&ids=${ids}`)
        return this.getResponse(response)
    }

    private getResponse(response: AxiosResponse) {
        if (response.statusText !== 'OK') {
            throw new Error('cryptocurrencies service not available')
        }
        const cryptocoins: CryptoCoin[] = []
        response.data.forEach((cryptocoin: any) => {
            const {
                id,
                symbol,
                name,
                current_price,
                image,
                last_updated
            } = cryptocoin
            cryptocoins.push(new CryptoCoin(id, symbol, name, current_price, image, new Date(last_updated)))
        })
        return cryptocoins
    }
}
