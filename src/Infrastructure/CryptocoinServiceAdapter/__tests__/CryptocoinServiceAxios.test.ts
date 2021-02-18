import { IConfig } from '../../../Interfaces/IConfig'
import { Container } from 'inversify'
import { TYPES } from '../../../IOC/types'
import { ICryptocoinService } from '../../../Interfaces/ICryptocoinService'
import { CryptocoinServiceAxios } from '../CryptocoinServiceAxios'
import { CryptoCoin } from '../../../Models/CryptoCoin'
import axios from 'axios'

const date = new Date('2021-02-17T14:00:00.000Z')
const cryptocoinTest = new CryptoCoin('id', 'symbol', 'name', 100, 'image', date)
const bitcoinTest = new CryptoCoin('bitcoin', 'symbol', 'name', 100, 'image', date)

jest.mock('axios', () => {
    return Object.assign(jest.fn(), {
        get: jest.fn().mockReturnValue(Promise.resolve({
            statusText: 'OK',
            data: [
                {
                    id: 'id',
                    symbol: 'symbol',
                    name: 'name',
                    current_price: 100,
                    image: 'image',
                    last_updated: '2021-02-17T14:00:00.000Z'
                },
                {
                    id: 'bitcoin',
                    symbol: 'symbol',
                    name: 'name',
                    current_price: 100,
                    image: 'image',
                    last_updated: '2021-02-17T14:00:00.000Z'
                }
            ]
        }))
    });
});

const configMock: IConfig = {
    serverPort: 8080,
    expirationMinutes: 10,
    cryptocoinUrl: 'url',
    secretToken: 'secret',
    database: {
        protocol: 'db',
        host: 'localhost',
        port: 3000,
        dbName: 'name',
        table: 'table'
    }
}

describe('Cryptocoin service axios adapter', () => {

    const container = new Container()
    container.bind<IConfig>(TYPES.Config).toConstantValue(configMock)
    container.bind<ICryptocoinService>(TYPES.CryptocoinService).to(CryptocoinServiceAxios)

    const service = container.get<ICryptocoinService>(TYPES.CryptocoinService)

    test('should return all cryptocoins from service when getCryptocoinsService is called', async () => {
        const response = await service.getCryptocoinsList('ars')

        expect(response).toEqual([cryptocoinTest, bitcoinTest])
    })

    test('should return user cryptocoins when getUserCryptocoins is called', async () => {
        const response = await service.getUserCryptocoins('ars', ['id', 'bitcoin'])

        expect(response).toEqual([cryptocoinTest, bitcoinTest])
    })

    test('should throw an error when service response is other than ok', async () => {
        jest.spyOn(axios, 'get').mockReturnValue(Promise.resolve({
            statusText: 'error'
        }))

        try {
            await service.getCryptocoinsList('ars')
        } catch (error) {
            expect(error.message).toBe('cryptocurrencies service not available')
        }
    })
})
