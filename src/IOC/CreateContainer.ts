import { IDatabase } from './../Domain/Interfaces/IDatabase'
import { Container } from 'inversify'
import { IServer } from '../Domain/Interfaces/IServer'
import { TYPES } from './types'
import { ExpressServer } from '../Infrastucture/ServerAdapter/ExpressServer'
import { IConfig } from '../Domain/Interfaces/IConfig'
import { config } from '../Infrastucture/Config'
import { MongoDatabase } from '../Infrastucture/DatabaseAdapter/MongoDatabase'

export const createContainer = (): Container => {
    let container = new Container()
    container.bind<IConfig>(TYPES.Config).toConstantValue(config)
    container.bind<IServer>(TYPES.Server).to(ExpressServer)
    container.bind<IDatabase>(TYPES.Database).to(MongoDatabase)

    return container
}