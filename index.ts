import { IServer } from './src/Interfaces/IServer'
import { Container } from 'inversify'
import { createContainer } from './src/IOC/CreateContainer'
import { TYPES } from './src/IOC/types'

const container: Container = createContainer()
const app = container.get<IServer>(TYPES.Server)
app.start()
