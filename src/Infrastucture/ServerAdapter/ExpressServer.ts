import { IConfig } from './../../Domain/Interfaces/IConfig'
import 'reflect-metadata'
import express, { Express } from 'express'
import cors from 'cors'
import { inject, injectable } from 'inversify'
import { TYPES } from '../../IOC/types'
import { IServer } from './../../Domain/Interfaces/IServer'

@injectable()
export class ExpressServer implements IServer {
    private app: Express
    private config: IConfig

    constructor(@inject(TYPES.Config) config: IConfig) {
        this.app = express()
        this.app.use(cors({ origin: '*' }))
        this.config = config
    }

    start(): void {
        this.app.listen(this.config.serverPort, () => {
            console.log(`Server running in http://localhost:${this.config.serverPort}`)
        })
    }
}