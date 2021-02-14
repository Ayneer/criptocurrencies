import { Container } from 'inversify'
import { TYPES } from './types'
import { IAuth } from '../Interfaces/IAuth'
import { IDatabase } from '../Interfaces/IDatabase'
import { IServer } from '../Interfaces/IServer'
import { ICriptoCurrenciesUseCase} from '../Interfaces/ICriptoCurrenciesUseCase'
import { ExpressServer } from '../Infrastucture/ServerAdapter/ExpressServer'
import { IConfig } from '../Interfaces/IConfig'
import { config } from '../Infrastucture/Config'
import { MongoDatabase } from '../Infrastucture/DatabaseAdapter/MongoDatabase'
import { JwtAuth } from '../Infrastucture/AuthAdapter/JwtAuth'
import { CriptoCurrenciesUseCase } from '../Domain/UseCases/CriptoCurrenciesUseCase'

let container: Container
const getContainer = () => {
    if (!container) {
        container = new Container()
        container.bind<IConfig>(TYPES.Config).toConstantValue(config)
        container.bind<IServer>(TYPES.Server).to(ExpressServer)
        container.bind<IDatabase>(TYPES.Database).to(MongoDatabase)
        container.bind<IAuth>(TYPES.Auth).to(JwtAuth).inSingletonScope()
        container.bind<ICriptoCurrenciesUseCase>(TYPES.CriptoCurrenciesUseCase).to(CriptoCurrenciesUseCase)
    }
    return container
}
container = getContainer()

export { container }

// export const createContainer = (): Container => {
//     const container = new Container()
//     container.bind<IConfig>(TYPES.Config).toConstantValue(config)
//     container.bind<IServer>(TYPES.Server).to(ExpressServer)
//     container.bind<IDatabase>(TYPES.Database).to(MongoDatabase)
//     container.bind<IAuth>(TYPES.Auth).to(JwtAuth).inSingletonScope()
//     container.bind<ICriptoCurrenciesUseCase>(TYPES.CriptoCurrenciesUseCase).to(CriptoCurrenciesUseCase)
//
//     return container
// }
