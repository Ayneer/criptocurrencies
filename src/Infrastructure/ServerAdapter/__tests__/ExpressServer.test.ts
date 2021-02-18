import { Container, injectable } from 'inversify'
import { IAuth } from '../../../Interfaces/IAuth'
import { User } from '../../../Models/User'
import { IConfig } from '../../../Interfaces/IConfig'
import { ICryptocoinUseCase } from '../../../Interfaces/ICryptocoinUseCase'
import { CryptoCoin } from '../../../Models/CryptoCoin'
import { TYPES } from '../../../IOC/types'
import { IServer } from '../../../Interfaces/IServer'
import { ExpressServer } from '../ExpressServer'
import { CryptocoinError } from '../../../Models/CryptocoinError'
import { ErrorType } from '../../../Models/ErrorType'

describe('Express server adapter', () => {
    let req: any
    let res: any
    const next = jest.fn()
    const json = jest.fn()
    const cryptocoinTest = new CryptoCoin('id', 'symbol', 'name', 100, 'image', new Date())
    let userTest: User = new User('id', 'name', 'lastname', 'userName', 'password', 'eur')
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

    @injectable()
    class AuthMock implements IAuth {
        encodePassword(password: string): Promise<string> {
            return Promise.resolve(password);
        }

        getNewToken(user: User): string {
            return 'token';
        }

        getUserData(token: string): User {
            return userTest;
        }

        isValidPassword(password: string, hash: string): Promise<boolean> {
            return Promise.resolve(password === 'valid');
        }

        isValidToken(token: string): boolean {
            return token === 'valid';
        }

        removeToken(token: string): void {
            return
        }
    }

    @injectable()
    class CryptocoinUseCaseMock implements ICryptocoinUseCase {
        addCryptocoinToUser(cryptocoinId: string, userId: string): Promise<void> {
            return Promise.resolve(undefined)
        }

        getCryptocoins(preferredCurrency: string): Promise<CryptoCoin[]> {
            if (preferredCurrency === 'error') {
                throw new CryptocoinError(ErrorType.CRYPTOCOIN_SERVICE_ERROR, null)
            }
            return Promise.resolve([cryptocoinTest])
        }

        getUserCryptocoins(limit: number, userId: string, order: string): Promise<CryptoCoin[]> {
            if (userId === 'error') {
                throw new CryptocoinError(ErrorType.CRYPTOCOIN_SERVICE_ERROR, null)
            }
            return Promise.resolve([cryptocoinTest])
        }

        login(userName: string, password: string): Promise<string> {
            if (userName === 'error') {
                throw new CryptocoinError(ErrorType.INVALID_CREDENTIALS, null)
            }
            return Promise.resolve('token')
        }

        registerUser(user: User): Promise<User> {
            if (user.name === 'error') {
                throw new CryptocoinError(ErrorType.EXISTING_USER, null)
            }
            return Promise.resolve(userTest)
        }
    }

    const container = new Container()
    container.bind<IAuth>(TYPES.Auth).to(AuthMock)
    container.bind<IConfig>(TYPES.Config).toConstantValue(configMock)
    container.bind<ICryptocoinUseCase>(TYPES.CryptocoinUseCase).to(CryptocoinUseCaseMock)
    container.bind<IServer>(TYPES.Server).to(ExpressServer)

    const server: ExpressServer = container.get(TYPES.Server)

    beforeEach(() => {
        userTest = new User('id', 'name', 'lastname', 'userName', 'password', 'eur')
        req = {
            body: {},
            query: {},
            params: {},
            get: () => 'bearer valid'
        }
        res = {
            status: jest.fn(() => ({
                json
            })),
            json
        }
    })

    test('should return ok when health check endpoint is called', async () => {
        await server.healthCheck(req, res)

        expect(json).toHaveBeenCalledWith('OK')
    })

    test('should return a new user when register new user endpoint is called successfully', async () => {
        req.body = {
            name: 'name',
            lastName: 'lastName',
            userName: 'userName',
            preferredCurrency: 'ars',
            password: 'Pass123+'
        }
        const userResponse = {
            _id: userTest._id,
            name: userTest.name,
            lastName: userTest.lastName,
            userName: userTest.userName,
            cryptoCoins: userTest.cryptoCoins,
            preferredCurrency: userTest.preferredCurrency,
        }

        await server.registerNewUser(req, res, next)

        expect(res.json).toHaveBeenCalledWith(userResponse)
    })

    test('should send an error when register new user endpoint is called with wrong data', async () => {
        req.body = {
            name: 'error',
            lastName: 'lastName',
            userName: 'userName',
            preferredCurrency: 'ars',
            password: 'Pass123+'
        }

        await server.registerNewUser(req, res, next)

        expect(next.mock.calls[0][0].status).toBe(400)
        expect(next.mock.calls[0][0].message).toBe('User already exists')
    })

    test('should send a new token when login endpoint is called with correct credentials', async () => {
        req.body = {
            userName: 'userName',
            password: 'password'
        }

        await server.login(req, res, next)

        expect(res.json).toHaveBeenCalledWith({ token: 'token' })
    })

    test('should send an error when login endpoint is called with wrong credentials', async () => {
        req.body = {
            userName: 'error',
            password: 'password'
        }

        await server.login(req, res, next)

        expect(next.mock.calls[0][0].status).toBe(401)
        expect(next.mock.calls[0][0].message).toBe('Invalid user or password')
    })

    test('should return cryptocoins when get cryptocoins endpoint is called', async () => {
        await server.getCryptocoins(req, res, next)

        expect(res.json).toHaveBeenCalledWith({ cryptocoins: [cryptocoinTest] })
    })

    test('should send an error when get cryptocoins endpoint is called and cryptocoins service fails', async () => {
        userTest.preferredCurrency = 'error'

        await server.getCryptocoins(req, res, next)

        expect(next.mock.calls[0][0].status).toBe(500)
        expect(next.mock.calls[0][0].message).toBe('cryptocurrencies service not available')
    })

    test('should return cryptocoins of user when ger user cryptocoins endpoint is called', async () => {
        await server.getUserCryptocoins(req, res, next)

        expect(res.json).toHaveBeenCalledWith({ cryptocoins: [cryptocoinTest] })
    })

    test('should send an error when get user cryptocoins endpoint is called and cryptocoins service fails',
        async () => {
        userTest._id = 'error'

        await server.getUserCryptocoins(req, res, next)

        expect(next.mock.calls[0][0].status).toBe(500)
        expect(next.mock.calls[0][0].message).toBe('cryptocurrencies service not available')
    })
})
