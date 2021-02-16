import { CryptocoinUseCase } from '../CryptocoinUseCase'
import { User } from '../../../Models/User'
import { IAuth } from '../../../Interfaces/IAuth'
import { IDatabase } from '../../../Interfaces/IDatabase'
import { ICryptocoinService } from '../../../Interfaces/ICryptocoinService'
import { Container, injectable } from 'inversify'
import { TYPES } from '../../../IOC/types'
import { CryptoCoin } from '../../../Models/CryptoCoin'
import { ICryptocoinUseCase } from '../../../Interfaces/ICryptocoinUseCase'
import 'reflect-metadata'



describe('Cryptocoin use case', () => {
    const cryptocoinTest = new CryptoCoin('id', 'symbol', 'name', 100, 'image', new Date())
    let userTest: User = new User('id', 'name', 'lastname', 'userName', 'password', 'eur')

    @injectable()
    class DatabaseMock implements IDatabase {
        createUser(user: User): Promise<User> {
            return Promise.resolve(user);
        }

        getUser(userId: string): Promise<User | undefined> {
            if (userId === 'existing') {
                return Promise.resolve(userTest)
            }
            return Promise.resolve(undefined)
        }

        getUserByUserName(userName: string): Promise<User | undefined> {
            if (userName === 'existing') {
                return Promise.resolve(userTest)
            }
            return Promise.resolve(undefined)
        }

        updateUser(user: User): Promise<void> {
            userTest = user
            return Promise.resolve(undefined);
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
    class CryptocoinServiceMock implements ICryptocoinService {
        getCryptocoinsList(preferredCurrency: string): Promise<CryptoCoin[]> {
            return Promise.resolve([cryptocoinTest]);
        }

        getUserCryptocoins(preferredCurrency: string, cryptocoins: string[]): Promise<CryptoCoin[]> {
            return Promise.resolve([cryptocoinTest, cryptocoinTest]);
        }

    }

    const container = new Container()
    container.bind<IDatabase>(TYPES.Database).to(DatabaseMock)
    container.bind<IAuth>(TYPES.Auth).to(AuthMock)
    container.bind<ICryptocoinService>(TYPES.CryptocoinService).to(CryptocoinServiceMock)
    container.bind<ICryptocoinUseCase>(TYPES.CryptocoinUseCase).to(CryptocoinUseCase)

    const useCase = container.get<ICryptocoinUseCase>(TYPES.CryptocoinUseCase)

    test('should return a created user when user does not exists', async () => {
        const user = await useCase.registerUser(userTest)

        expect(user).toEqual(userTest)
    })

    test('should throw an error creating user when user already exists', async () => {
        userTest.userName = 'existing'

        try {
            await useCase.registerUser(userTest)
        } catch (error) {
            expect(error.message).toBe('User already exists')
        }
    })

    test('should return a new token when user login with valid password', async () => {
        const token = await useCase.login(userTest.userName, 'valid')

        expect(token).toBe('token')
    })

    test('should throw an error when password is wrong', async () => {
        try {
            await useCase.login(userTest.userName, userTest.password)
        } catch (error) {
            expect(error.message).toBe('Invalid user or password')
        }
    })

    test('should throw an error when username is wrong', async () => {
        userTest.userName = 'userName'

        try {
            await useCase.login(userTest.userName, userTest.password)
        } catch (error) {
            expect(error.message).toBe('Invalid user or password')
        }
    })

    test('should return cryptocoins when getCryptocoins is called', async () => {
        const cryptocoins = await useCase.getCryptocoins(userTest.preferredCurrency)

        expect(cryptocoins).toEqual([cryptocoinTest])
    })

    test('should return user cryptocoins when user has some cryptocoin', async () => {
        userTest._id = 'existing'
        userTest.cryptoCoins.push(cryptocoinTest)

        const cryptocoins = await useCase.getUserCryptocoins(10, userTest._id, 'desc')

        expect(cryptocoins).toEqual([cryptocoinTest, cryptocoinTest])
    })

    test('should throw an error when user does not exists', async () => {
        userTest._id = 'id'

        try {
            await useCase.getUserCryptocoins(10, userTest._id, 'desc')
        } catch (error) {
            expect(error.message).toBe('user not found')
        }
    })

    test('should add cryptocoin to user when user exists', async () => {
        userTest._id = 'existing'
        userTest.cryptoCoins = []

        await useCase.addCryptocoinToUser('bitcoin', userTest._id)

        expect(userTest.cryptoCoins).toEqual([cryptocoinTest])
    })

    test('should throw an error when user to add coin does not exists', async () => {
        userTest._id = 'id'

        try {
            await useCase.addCryptocoinToUser('bitcoin', userTest._id)
        } catch (error) {
            expect(error.message).toBe('user not found')
        }
    })

    test('should throw an error when user already has the cryptocoin', async () => {
        userTest._id = 'existing'
        userTest.cryptoCoins.push(cryptocoinTest)

        try {
            await useCase.addCryptocoinToUser('id', userTest._id)
        } catch (error) {
            expect(error.message).toBe('The cryptocoin already was added')
        }
    })
})
