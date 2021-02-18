import { ErrorType } from './ErrorType'

export class CryptocoinError extends Error {
    public status: number
    public message: string
    public detail: any

    constructor(errorType: ErrorType, detail: any) {
        super(detail)
        this.detail = detail
        switch (errorType) {
            case ErrorType.CRYPTOCOIN_DUPLICATED:
                this.status = 400
                this.message = 'The cryptocoin already was added'
                break
            case ErrorType.CRYPTOCOIN_SERVICE_ERROR:
                this.status = 500
                this.message = 'cryptocurrencies service not available'
                break
            case ErrorType.EXISTING_USER:
                this.status = 400
                this.message = 'User already exists'
                break
            case ErrorType.INVALID_CREDENTIALS:
                this.status = 401
                this.message = 'Invalid user or password'
                break
            case ErrorType.USER_NOT_FOUND:
                this.status = 404
                this.message = 'user not found'
                break
            default:
                this.status = 500
                this.message = 'System error, please contact with service admin'
        }

    }

}
