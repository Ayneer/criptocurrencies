import { IConfig } from '../Interfaces/IConfig'

export const config: IConfig = {
    serverPort: parseInt(process.env.SERVER_PORT || '8080'),
    secretToken: process.env.SECRET_TOKEN || 'mySecret',
    database: {
        protocol: process.env.DB_PROTOCOL || 'mongodb',
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '27017'),
        dbName: process.env.DB_NAME || 'criptocurrencies',
        table: 'users'
    }
}
