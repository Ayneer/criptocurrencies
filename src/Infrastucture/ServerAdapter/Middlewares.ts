import Joi from 'joi'
import { Request, Response, NextFunction } from 'express'
import { inject } from 'inversify'
import { TYPES } from '../../IOC/types'
import { IAuth } from '../../Interfaces/IAuth'

export class Middlewares {
    private auth: IAuth

    constructor(@inject(TYPES.Auth) auth: IAuth) {
        this.auth = auth
    }

    private newUserRequest = Joi.object({
        name: Joi.string().required(),
        lastName: Joi.string().required(),
        userName: Joi.string().required(),
        password: Joi.string().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[ -/:-@\[-`{-~]).{6,20}$/).required()
    })

    private loginRequest = Joi.object({
        userName: Joi.string().required(),
        password: Joi.string().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[ -/:-@\[-`{-~]).{6,20}$/).required()
    })

    public validateNewUserRequest(req: Request, res: Response, next: NextFunction) {
        const errors = this.newUserRequest.validate(req.body)
        if (errors) {
            res.status(400).json(errors)
            return
        }
        next()
    }

    public validateLoginRequest(req: Request, res: Response, next: NextFunction) {
        const errors = this.loginRequest.validate(req.body)
        if (errors) {
            res.status(400).json(errors)
            return
        }
        next()
    }

    public validateAuthorization(req: Request, res: Response, next: NextFunction) {
        const token = req.get('Authorization')
        if (!token || this.auth.isValidToken(token.split(' ')[1])) {
            res.status(401).json('Unauthorized')
            return
        }
        next()
    }
}
