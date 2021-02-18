import { IConfig } from '../../../Interfaces/IConfig'
import { Container } from 'inversify'
import { TYPES } from '../../../IOC/types'
import { IAuth } from '../../../Interfaces/IAuth'
import { JwtAuth } from '../JwtAuth'
import { User } from '../../../Models/User'

const user = new User('id', 'name', 'lastName', 'userName', 'pass', 'ars')
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

jest.mock('bcrypt', () => {
    return {
        hash: jest.fn(() => 'encodedPassword'),
        compare: jest.fn(() => true)
    }
})

jest.mock('jsonwebtoken', () => {
    return {
        sign: jest.fn(() => 'token'),
        verify: jest.fn(token => {
            if (token !== 'token') {
                throw new Error('error')
            }
            return true
        }),
        decode: jest.fn(() => user)
    }
})

describe('Jwt Auth adapter', () => {

    const container = new Container()
    container.bind<IConfig>(TYPES.Config).toConstantValue(configMock)
    container.bind<IAuth>(TYPES.Auth).to(JwtAuth)

    const jwtAuth = container.get<IAuth>(TYPES.Auth)

    test('should encode password when encodePassword function is called', async () => {
        const passwordEncoded = await jwtAuth.encodePassword('password')

        expect(passwordEncoded).toBe('encodedPassword')
    })

    test('should validate the password when isValidPassword function is called', async () => {
        const isValid = await jwtAuth.isValidPassword('password', 'hash')

        expect(isValid).toBeTruthy()
    })

    test('should return a new token when the function isi called with a user', () => {
        const token = jwtAuth.getNewToken(user)

        expect(token).toBe('token')
    })

    test('should return true when token is valid and exists in the app', () => {
        const token = 'token'
        jwtAuth.getNewToken(user)

        const isValid = jwtAuth.isValidToken(token)

        expect(isValid).toBeTruthy()
    })

    test('should return false when token is invalid', () => {
        const token = 'invalid'
        jwtAuth.getNewToken(user)

        const isValid = jwtAuth.isValidToken(token)

        expect(isValid).toBeFalsy()
    })

    test('should return false when token is removed from app', () => {
        const token = jwtAuth.getNewToken(user)

        jwtAuth.removeToken(token)
        const isValid = jwtAuth.isValidToken(token)

        expect(isValid).toBeFalsy()
    })

    test('should return user data when getUserData is called with a token', () => {
        const token = jwtAuth.getNewToken(user)

        const userData = jwtAuth.getUserData(token)

        expect(userData).toEqual(userData)
    })
})
