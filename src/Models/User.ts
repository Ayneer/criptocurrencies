import { CriptoCoin } from './CriptoCoin'

export class User {
    public id: string
    public name: string
    public lastName: string
    public userName: string
    public password: string
    public currencies?: CriptoCoin[]
    public preferredCurrency?: CriptoCoin

    constructor(id: string, name: string, lastName: string, userName: string, password: string) {
        this.id = id
        this.name = name
        this.lastName = lastName
        this.userName = userName
        this.password = password
    }
}