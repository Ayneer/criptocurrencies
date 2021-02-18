import { IConfig } from '../../Interfaces/IConfig'
import 'reflect-metadata'
import express, { Express, NextFunction, Request, Response, Router } from 'express'
import cors from 'cors'
import { inject, injectable } from 'inversify'
import { TYPES } from '../../IOC/types'
import { IServer } from '../../Interfaces/IServer'
import { ICryptocoinUseCase } from '../../Interfaces/ICryptocoinUseCase'
import { User } from '../../Models/User'
import { v4 as uuid } from 'uuid'
import { Utils } from '../../Domain/Utils'
import { Middlewares } from './Middlewares'
import { IAuth } from '../../Interfaces/IAuth'

@injectable()
export class ExpressServer implements IServer {

    private app: Express
    private config: IConfig
    private cryptoCurrenciesUseCase: ICryptocoinUseCase
    private auth: IAuth

    constructor(@inject(TYPES.Config) config: IConfig,
                @inject(TYPES.CryptocoinUseCase) cryptoCurrenciesUseCase: ICryptocoinUseCase,
                @inject(TYPES.Auth) auth: IAuth) {
        this.auth = auth
        this.app = express()
        this.app.use(cors({ origin: '*' }))
        this.app.use(express.json())
        this.config = config
        this.cryptoCurrenciesUseCase = cryptoCurrenciesUseCase
    }

    start(): void {
        this.app.use('/cryptocoins/v1/api', this.createRoutes())
        this.app.use(Middlewares.errorHandler)
        this.app.listen(this.config.serverPort, () => {
            console.log(`Server running in http://localhost:${this.config.serverPort}`)
        })
    }

    private createRoutes(): Router {
        const router = express.Router()
        router.get('/health', (req: Request, res: Response) => this.healthCheck(req, res))
        router.post('/signIn',
            Middlewares.validateNewUserRequest,
            (req: Request, res: Response, next: NextFunction) => this.registerNewUser(req, res, next))
        router.post('/login',
            Middlewares.validateLoginRequest,
            (req: Request, res: Response, next: NextFunction) => this.login(req, res, next))
        router.get('/cryptocoins',
            Middlewares.validateAuthorization,
            (req: Request, res: Response, next: NextFunction) => this.getCryptocoins(req, res, next))
        router.put('/cryptocoins/:cryptocoin',
            Middlewares.validateAuthorization,
            Middlewares.validateCryptocoinRequest,
            ((req: Request, res: Response, next: NextFunction) => this.addCryptocoin(req, res, next)))
        router.get('/userCryptocoins',
            Middlewares.validateAuthorization,
            Middlewares.validateUserCryptocoinsRequets,
            (req: Request, res: Response, next: NextFunction) => this.getUserCryptocoins(req, res, next))
        return router
    }

    public async healthCheck(req: Request, res: Response) {
        res.json('OK')
    }

    public async registerNewUser(req: Request, res: Response, next: NextFunction) {
        try {
            const { name, lastName, userName, password, preferredCurrency } = req.body
            const user = new User(uuid(), name, lastName, userName, password, preferredCurrency)
            const savedUser = await this.cryptoCurrenciesUseCase.registerUser(user)
            res.json(Utils.getUserResponse(savedUser))
        } catch (error) {
            next(error)
        }
    }

    public async login(req: Request, res: Response, next: NextFunction) {
        try {
            const { userName, password } = req.body
            const token = await this.cryptoCurrenciesUseCase.login(userName, password)
            res.json({ token })
        } catch (error) {
            next(error)
        }
    }

    public async getCryptocoins(req: Request, res: Response, next: NextFunction) {
        try {
            const user: User = this.getUserData(req)
            const cryptocoins = await this.cryptoCurrenciesUseCase.getCryptocoins(user.preferredCurrency)
            res.json({ cryptocoins })
        } catch (error) {
            next(error)
        }
    }

    public async addCryptocoin(req: Request, res: Response, next: NextFunction) {
        try {
            const user: User = this.getUserData(req)
            const cryptocoin = req.params.cryptocoin
            await this.cryptoCurrenciesUseCase.addCryptocoinToUser(cryptocoin, user._id)
            res.json('coin added to user')
        } catch (error) {
            next(error)
        }
    }

    public async getUserCryptocoins(req: Request, res: Response, next: NextFunction) {
        try {
            const user: User = this.getUserData(req)
            const limit: any = req.query.limit
            const order: any = req.query.order
            const cryptocoins = await this.cryptoCurrenciesUseCase.getUserCryptocoins(limit, user._id, order)
            res.json({ cryptocoins })
        } catch (error) {
            next(error)
        }
    }

    private getUserData(req: Request) {
        const token = req.get('authorization')
        return this.auth.getUserData(token ? token.split(' ')[1]: '')
    }
}
