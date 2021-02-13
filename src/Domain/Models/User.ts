import { CriptoCoin } from './CriptoCoin'

export class User {
    public id: string
    public userName: string
    public password: string
    public currencies?: CriptoCoin[]

    constructor(id: string, userName: string, password: string) {
        this.id = id
        this.userName = userName
        this.password = password
    }
}