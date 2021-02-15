import { ICriptocoinService } from '../../Interfaces/ICriptocoinService'
import { inject, injectable } from 'inversify'
import axios, { AxiosResponse } from 'axios'
import { CriptoCoin } from '../../Models/CriptoCoin'
import { TYPES } from '../../IOC/types'
import { IConfig } from '../../Interfaces/IConfig'

@injectable()
export class CriptocoinServiceAxios implements ICriptocoinService {

    private criptocoinUrl: string

    constructor(@inject(TYPES.Config) config: IConfig) {
        this.criptocoinUrl = config.criptocoinUrl
    }

    public async getCriptocoinsList(preferredCurrency: string): Promise<CriptoCoin[]> {
        const response: AxiosResponse = await axios.get(`${this.criptocoinUrl}/coins/markets?vs_currency=${preferredCurrency}`)
        return this.getResponse(response)
    }

    public async getUserCriptocoins(preferredCurrency: string, criptocoins: string[]): Promise<CriptoCoin[]> {
        const ids = criptocoins.join(',')
        const response = await axios.get(`${this.criptocoinUrl}/coins/markets?vs_currency=${preferredCurrency}&ids=${ids}`)
        return this.getResponse(response)
    }

    private getResponse(response: AxiosResponse) {
        if (response.statusText !== 'OK') {
            throw new Error('criptocurrencies service not available')
        }
        const criptocoins: CriptoCoin[] = []
        response.data.forEach((criptocoin: any) => {
            const {
                id,
                symbol,
                name,
                current_price,
                image,
                last_updated
            } = criptocoin
            criptocoins.push(new CriptoCoin(id, symbol, name, current_price, image, new Date(last_updated)))
        })
        return criptocoins
    }
}
