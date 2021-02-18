import { IConfig } from '../../../Interfaces/IConfig'
import { Container } from 'inversify'
import { TYPES } from '../../../IOC/types'
import { IDatabase } from '../../../Interfaces/IDatabase'
import { MongoDatabase } from '../MongoDatabase'
import { User } from '../../../Models/User'

const user = new User('id', 'name', 'lastName', 'userName', 'pass', 'ars')
jest.mock('mongoose', () => {
    return {
        connect: jest.fn(),
        Schema: jest.fn(),
        model: jest.fn(() => {
            return {
                create: (data: any) => Promise.resolve({ toObject: () => data }),
                findById: () => Promise.resolve({ toObject: () => user }),
                find: () => Promise.resolve([{ toObject: () => user }]),
                updateOne: () => {}
            }
        })
    }
})

describe('Mongo database adapter', () => {
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

    const container = new Container()
    container.bind<IConfig>(TYPES.Config).toConstantValue(configMock)
    container.bind<IDatabase>(TYPES.Database).to(MongoDatabase)

    const database = container.get<IDatabase>(TYPES.Database)

    test('should return the new user when createUser function is called', async () => {
        const response = await database.createUser(user)

        expect(response).toEqual(user)
    })

    test('should return the requested user when getUser function is called', async () => {
        const response = await database.getUser('userId')

        expect(response).toEqual(user)
    })

    test('should return the requested user when getUserByUserName function is called', async () => {
        const response = await database.getUserByUserName('userName')

        expect(response).toEqual(user)
    })

    test('should update the user data when updateUser function is called', async () => {
        const response = await database.updateUser(user)

        expect(response).toBeUndefined()
    })
})
