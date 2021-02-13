import { User } from './../../Domain/Models/User'
import { IConfig } from './../../Domain/Interfaces/IConfig'
import { IDatabase } from './../../Domain/Interfaces/IDatabase'
import { inject, injectable } from 'inversify'
import mongoose, { Model } from 'mongoose'
import { TYPES } from '../../IOC/types'


@injectable()
export class MongoDatabase implements IDatabase {

    private collection: string
    private userModel: Model<any>

    constructor(@inject(TYPES.Config) config: IConfig) {
        this.collection = config.database.table
        const connectionString = `${config.database.protocol}://${config.database.host}:${config.database.port}/${config.database.dbName}`
        mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true })
        let schema = new mongoose.Schema(this.getUserSchema(), { toObject: { getters: true } })
        this.userModel = mongoose.model(this.collection, schema)
    }

    private getUserSchema() {
        return {
            id: String,
            userName: String,
            password: String,
            currencies: [{
                id: String,
                symbol: String,
                name: String
            }]
        }
    }

    async createUser(user: User): Promise<User> {
        return this.userModel.create(user)
    }

    async getUser(userId: string): Promise<User> {
        return this.userModel.findById(userId)
    }

    async getUserByName(userName: string): Promise<User> {
        return (await this.userModel.find({ name: userName }))[0]
    }

    async updateUser(user: User): Promise<User> {
        return this.userModel.updateOne({ id: user.id }, user)
    }
}