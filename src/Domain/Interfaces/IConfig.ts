export interface IConfig {
    serverPort: number
    database: {
        protocol: string
        host: string
        port: number
        dbName: string
        table: string
    }
}