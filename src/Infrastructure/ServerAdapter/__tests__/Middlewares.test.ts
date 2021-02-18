import { Middlewares } from '../Middlewares'
import { CryptocoinError } from '../../../Models/CryptocoinError'
import { ErrorType } from '../../../Models/ErrorType'

jest.mock('../../../IOC/CreateContainer', () => {
    return {
        container: {
            get: () => {
                return {
                    isValidToken: (token: string) => token === 'valid'
                }
            }
        }
    }
})

describe('Middlewares server adapter', () => {
    let req: any
    let res: any
    const next = jest.fn()
    const json = jest.fn()

    beforeEach(() => {
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
        }
    })

    test('should pass successfully when the request body has all correct fields', () => {
        req.body = {
            name: 'name',
            lastName: 'lastName',
            userName: 'userName',
            preferredCurrency: 'ars',
            password: 'Pass123+'
        }

        Middlewares.validateNewUserRequest(req, res, next)

        expect(next).toHaveBeenCalled()
    })

    test('should send error message when the request body has any field wrong', () => {
        req.body = {
            name: 'name',
            userName: 'userName',
            preferredCurrency: 'ars',
            password: 'Pass123+'
        }

        Middlewares.validateNewUserRequest(req, res, next)

        expect(res.status).toHaveBeenCalledWith(400)
        expect(json).toHaveBeenCalledWith('"lastName" is required')
    })

    test('should pass successfully when user and password are provided', () => {
        req.body = {
            userName: 'userName',
            password: 'password'
        }

        Middlewares.validateLoginRequest(req, res, next)

        expect(next).toHaveBeenCalled()
    })

    test('should send error when password are not provided', () => {
        req.body = {
            userName: 'userName'
        }

        Middlewares.validateLoginRequest(req, res, next)

        expect(res.status).toHaveBeenCalledWith(400)
        expect(json).toHaveBeenCalledWith('"password" is required')
    })

    test('should pass successfully when token authorization is valid', () => {
        Middlewares.validateAuthorization(req, res, next)

        expect(next).toHaveBeenCalled()
    })

    test('should send error when token authorization is invalid', () => {
        req.get = () => 'invalid token'

        Middlewares.validateAuthorization(req, res, next)

        expect(res.status).toHaveBeenCalledWith(401)
        expect(json).toHaveBeenCalledWith('Unauthorized')
    })

    test('should pass successfully when cryptocoin request is correct', () => {
        req.params = {
            cryptocoin: 'bitcoin'
        }

        Middlewares.validateCryptocoinRequest(req, res, next)

        expect(next).toHaveBeenCalled()
    })

    test('should send error when cryptocoin request is incorrect', () => {
        Middlewares.validateCryptocoinRequest(req, res, next)

        expect(res.status).toHaveBeenCalledWith(400)
        expect(json).toHaveBeenCalledWith('"cryptocoin" is required')
    })

    test('should pass successfully when parameters are provided', () => {
        req.query = {
            limit: 10,
            order: 'asc'
        }

        Middlewares.validateUserCryptocoinsRequets(req, res, next)

        expect(next).toHaveBeenCalled()
    })

    test('should send error when required parameters are not provided', () => {
        req.query = {
            order: 'asc'
        }

        Middlewares.validateUserCryptocoinsRequets(req, res, next)

        expect(res.status).toHaveBeenCalledWith(400)
        expect(json).toHaveBeenCalledWith('"limit" is required')
    })

    test('should send error response when error handler middleware receive an error', () => {
        const error = new CryptocoinError(ErrorType.EXISTING_USER, null)

        Middlewares.errorHandler(error, req, res, next)

        expect(res.status).toHaveBeenCalledWith(400)
        expect(json).toHaveBeenCalledWith({ error: error.message })
    })
})
