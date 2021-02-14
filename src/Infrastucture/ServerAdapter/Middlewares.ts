import { Request, Response, NextFunction } from 'express'
import { TYPES } from '../../IOC/types'
import { IAuth } from '../../Interfaces/IAuth'
import { container } from '../../IOC/CreateContainer'
import { loginRequest, newUserRequest } from './RequestModels'

export class Middlewares {

    public static validateNewUserRequest(req: Request, res: Response, next: NextFunction) {
        const { error } = newUserRequest.validate(req.body)
        if (error) {
            res.status(400).json(error?.details[0].message)
            return
        }
        next()
    }

    public static validateLoginRequest(req: Request, res: Response, next: NextFunction) {
        const { error } = loginRequest.validate(req.body)
        if (error) {
            res.status(400).json(error?.details[0].message)
            return
        }
        next()
    }

    public static validateAuthorization(req: Request, res: Response, next: NextFunction) {
        const token = req.get('Authorization')
        const auth = container.get<IAuth>(TYPES.Auth)
        if (!token || !auth.isValidToken(token.split(' ')[1])) {
            res.status(401).json('Unauthorized')
            return
        }
        next()
    }
}
