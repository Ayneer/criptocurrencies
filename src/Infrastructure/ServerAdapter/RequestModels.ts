import Joi from 'joi'

const newUserRequest = Joi.object({
    name: Joi.string().required(),
    lastName: Joi.string().required(),
    userName: Joi.string().required(),
    password: Joi.string().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[ -/:-@\[-`{-~]).{8,20}$/).required(),
    preferredCurrency: Joi.string().valid('eur', 'usd', 'ars').required()
})

const loginRequest = Joi.object({
    userName: Joi.string().required(),
    password: Joi.string().required()
})

const criptocoinRequest = Joi.string().required()

export {
    newUserRequest,
    loginRequest,
    criptocoinRequest
}
