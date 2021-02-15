import { Container } from 'inversify'
import { TYPES } from './types'
import { IAuth } from '../Interfaces/IAuth'
import { IDatabase } from '../Interfaces/IDatabase'
import { IServer } from '../Interfaces/IServer'
import { ICriptocoinUseCase} from '../Interfaces/ICriptocoinUseCase'
import { ExpressServer } from '../Infrastructure/ServerAdapter/ExpressServer'
import { IConfig } from '../Interfaces/IConfig'
import { config } from '../Infrastructure/Config'
import { MongoDatabase } from '../Infrastructure/DatabaseAdapter/MongoDatabase'
import { JwtAuth } from '../Infrastructure/AuthAdapter/JwtAuth'
import { CriptocoinUseCase } from '../Domain/UseCases/CriptocoinUseCase'
import { CriptocoinServiceAxios } from '../Infrastructure/CriptocoinServiceAdapter/CriptocoinServiceAxios'
import { ICriptocoinService } from '../Interfaces/ICriptocoinService'

let container: Container
const getContainer = () => {
    if (!container) {
        container = new Container()
        container.bind<IConfig>(TYPES.Config).toConstantValue(config)
        container.bind<IServer>(TYPES.Server).to(ExpressServer)
        container.bind<IDatabase>(TYPES.Database).to(MongoDatabase)
        container.bind<IAuth>(TYPES.Auth).to(JwtAuth).inSingletonScope()
        container.bind<ICriptocoinUseCase>(TYPES.CriptocoinUseCase).to(CriptocoinUseCase)
        container.bind<ICriptocoinService>(TYPES.CriptocoinService).to(CriptocoinServiceAxios)
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
//     container.bind<ICriptocoinUseCase>(TYPES.CriptocoinUseCase).to(CriptocoinUseCase)
//
//     return container
// }
