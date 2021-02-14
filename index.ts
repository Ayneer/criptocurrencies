import { IServer } from './src/Interfaces/IServer'
import { container } from './src/IOC/CreateContainer'
import { TYPES } from './src/IOC/types'

const app = container.get<IServer>(TYPES.Server)
app.start()
