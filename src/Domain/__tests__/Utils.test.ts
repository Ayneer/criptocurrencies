import { User } from '../../Models/User'
import { Utils } from '../Utils'

describe('Utils', () => {
    const userTest: User = new User('id', 'name', 'lastname', 'userName', 'password', 'eur')

    test('should return and object with user data when getUserResponse function is called', () => {
        const userResponse = Utils.getUserResponse(userTest)

        expect(userResponse).toEqual({
            _id: "id",
            cryptoCoins: [],
            lastName: "lastname",
            name: "name",
            preferredCurrency: "eur",
            userName: "userName",
        })
    })
})
