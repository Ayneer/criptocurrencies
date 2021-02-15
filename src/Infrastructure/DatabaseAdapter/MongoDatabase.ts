import { User } from '../../Models/User'
import { IConfig } from '../../Interfaces/IConfig'
import { IDatabase } from '../../Interfaces/IDatabase'
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
        const schema = new mongoose.Schema(this.getUserSchema(), { toObject: { getters: true }, versionKey: false })
        this.userModel = mongoose.model(this.collection, schema)
    }

    private getUserSchema() {
        return {
            _id: String,
            name: String,
            lastName: String,
            userName: String,
            password: String,
            preferredCurrency: String,
            cryptoCoins: [{
                id: String,
                symbol: String,
                name: String,
                price: String,
                image: String,
                date: Date
            }]
        }
    }

    async createUser(user: User): Promise<User> {
        return this.userModel.create(user).then(data => data?.toObject())
    }

    async getUser(userId: string): Promise<User> {
        return this.userModel.findById(userId).then(data => data?.toObject())
    }

    async getUserByUserName(userName: string): Promise<User> {
        const response = await this.userModel.find({ userName })
        return response[0]?.toObject()
    }

    async updateUser(user: User): Promise<void> {
        return this.userModel.updateOne({ _id: user._id }, user)
    }
}
