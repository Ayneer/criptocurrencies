export class CriptoCoin {
    public id: string
    public symbol: string
    public name: string

    constructor(id: string, symbol: string, name: string) {
        this.id = id
        this.symbol = symbol
        this.name = name
    }
}