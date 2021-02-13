export interface IConfig {
    serverPort: number
    secretToken: string
    database: {
        protocol: string
        host: string
        port: number
        dbName: string
        table: string
    }
}