import { Container } from 'inversify'
import { TYPES } from './types'
import { IAuth } from '../Interfaces/IAuth'
import { IDatabase } from '../Interfaces/IDatabase'
import { IServer } from '../Interfaces/IServer'
import { ICryptocoinUseCase} from '../Interfaces/ICryptocoinUseCase'
import { ExpressServer } from '../Infrastructure/ServerAdapter/ExpressServer'
import { IConfig } from '../Interfaces/IConfig'
import { config } from '../Infrastructure/Config'
import { MongoDatabase } from '../Infrastructure/DatabaseAdapter/MongoDatabase'
import { JwtAuth } from '../Infrastructure/AuthAdapter/JwtAuth'
import { CryptocoinUseCase } from '../Domain/UseCases/CryptocoinUseCase'
import { CryptocoinServiceAxios } from '../Infrastructure/CryptocoinServiceAdapter/CryptocoinServiceAxios'
import { ICryptocoinService } from '../Interfaces/ICryptocoinService'

let container: Container
const getContainer = () => {
    if (!container) {
        container = new Container()
        container.bind<IConfig>(TYPES.Config).toConstantValue(config)
        container.bind<IServer>(TYPES.Server).to(ExpressServer)
        container.bind<IDatabase>(TYPES.Database).to(MongoDatabase)
        container.bind<IAuth>(TYPES.Auth).to(JwtAuth).inSingletonScope()
        container.bind<ICryptocoinUseCase>(TYPES.CryptocoinUseCase).to(CryptocoinUseCase).inSingletonScope()
        container.bind<ICryptocoinService>(TYPES.CryptocoinService).to(CryptocoinServiceAxios)
    }
    return container
}
container = getContainer()

export { container }
