import { IConfig } from '../../Interfaces/IConfig'
import 'reflect-metadata'
import express, { Express, Request, Response, Router } from 'express'
import cors from 'cors'
import { inject, injectable } from 'inversify'
import { TYPES } from '../../IOC/types'
import { IServer } from '../../Interfaces/IServer'
import { ICriptoCurrenciesUseCase } from '../../Interfaces/ICriptoCurrenciesUseCase'
import { User } from '../../Models/User'
import { v4 as uuid } from 'uuid'
import { Utils } from '../../Domain/Utils'
import { Middlewares } from './Middlewares'
import { IAuth } from '../../Interfaces/IAuth'

@injectable()
export class ExpressServer implements IServer {

    private app: Express
    private config: IConfig
    private criptoCurrenciesUseCase: ICriptoCurrenciesUseCase
    private auth: IAuth

    constructor(@inject(TYPES.Config) config: IConfig,
                @inject(TYPES.CriptoCurrenciesUseCase) criptoCurrenciesUseCase: ICriptoCurrenciesUseCase,
                @inject(TYPES.Auth) auth: IAuth) {
        this.auth = auth
        this.app = express()
        this.app.use(cors({ origin: '*' }))
        this.app.use(express.json())
        this.config = config
        this.criptoCurrenciesUseCase = criptoCurrenciesUseCase
    }

    start(): void {
        this.app.use('/criptocurrencies/v1/api', this.createRoutes())
        this.app.listen(this.config.serverPort, () => {
            console.log(`Server running in http://localhost:${this.config.serverPort}`)
        })
    }

    private createRoutes(): Router {
        const router = express.Router()
        router.get('/health', (req: Request, res: Response) => this.healthCheck(req, res))
        router.post('/signIn',
            Middlewares.validateNewUserRequest,
            (req: Request, res: Response) => this.registerNewUser(req, res))
        router.post('/login',
            Middlewares.validateLoginRequest,
            (req: Request, res: Response) => this.login(req, res))
        router.get('/currencies',
            Middlewares.validateAuthorization,
            (req: Request, res: Response) => this.getCurrencies(req, res))
        return router
    }

    private async healthCheck(req: Request, res: Response) {
        res.json('OK')
    }

    private async registerNewUser(req: Request, res: Response) {
        try {
            const { name, lastName, userName, password, preferredCurrency } = req.body
            const user = new User(uuid(), name, lastName, userName, password, preferredCurrency)
            const savedUser = await this.criptoCurrenciesUseCase.registerUser(user)
            res.json(Utils.getUserResponse(savedUser))
        } catch (error) {
            res.status(400).json(error.message)
        }
    }

    private async login(req: Request, res: Response) {
        try {
            const { userName, password } = req.body
            const token = await this.criptoCurrenciesUseCase.login(userName, password)
            res.json({ token })
        } catch (error) {
            res.status(401).json(error.message)
        }
    }

    private async getCurrencies(req: Request, res: Response) {
        try {
            const token = req.get('authorization')
            const user: User = await this.auth.getUserData(token ? token.split(' ')[1]: '')
            const currencies = await this.criptoCurrenciesUseCase.getCriptoCurrencies(user.preferredCurrency)
            res.json({ currencies })
        } catch (error) {
            res.status(404).json(error.message)
        }
    }
}
