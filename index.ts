import { IServer } from './src/Domain/Interfaces/IServer'
import { Container } from 'inversify'
import { createContainer } from './src/IOC/CreateContainer'
import { TYPES } from './src/IOC/types'

let container: Container = createContainer()
let app = container.get<IServer>(TYPES.Server)
app.start()