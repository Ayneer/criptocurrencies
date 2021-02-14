const TYPES = {
    Server: Symbol.for('IServer'),
    Config: Symbol.for('IConfig'),
    Database: Symbol.for('IDatabase'),
    Auth: Symbol.for('IAuth'),
    CriptoCurrenciesUseCase: Symbol.for('ICriptoCurrenciesUseCase'),
    Middlewares: Symbol.for('IMiddlewares')
}

export { TYPES }
