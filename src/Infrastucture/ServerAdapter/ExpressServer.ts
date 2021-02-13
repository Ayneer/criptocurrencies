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

@injectable()
export class ExpressServer implements IServer {

    private app: Express
    private config: IConfig
    private criptoCurrenciesUseCase: ICriptoCurrenciesUseCase

    constructor(@inject(TYPES.Config) config: IConfig,
                @inject(TYPES.CriptoCurrenciesUseCase) criptoCurrenciesUseCase: ICriptoCurrenciesUseCase) {
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
        router.get('/health', this.healthCheck.bind(this))
        router.post('/signIn', this.registerNewUser.bind(this))
        return router
    }

    private async healthCheck(req: Request, res: Response) {
        res.json('OK')
    }

    private async registerNewUser(req: Request, res: Response) {
        try {
            const body = req.body
            const user = new User(uuid(), body.name, body.lastName, body.userName, body.password)
            const savedUser = await this.criptoCurrenciesUseCase.registerUser(user)
            res.json(savedUser)
        } catch (error) {
            res.status(400).json(error.message)
        }
    }
}
