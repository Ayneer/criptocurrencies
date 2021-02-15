const TYPES = {
    Server: Symbol.for('IServer'),
    Config: Symbol.for('IConfig'),
    Database: Symbol.for('IDatabase'),
    Auth: Symbol.for('IAuth'),
    CryptocoinUseCase: Symbol.for('ICryptocoinUseCase'),
    CryptocoinService: Symbol.for('ICryptocoinService')
}

export { TYPES }
