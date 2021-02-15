import { CryptoCoin } from './CryptoCoin'

export class User {
    public _id: string
    public name: string
    public lastName: string
    public userName: string
    public password: string
    public cryptoCoins: CryptoCoin[]
    public preferredCurrency: string

    constructor(id: string,
                name: string,
                lastName: string,
                userName: string,
                password: string,
                preferredCurrency: string
    ) {
        this._id = id
        this.name = name
        this.lastName = lastName
        this.userName = userName
        this.password = password
        this.preferredCurrency = preferredCurrency
        this.cryptoCoins = []
    }
}
