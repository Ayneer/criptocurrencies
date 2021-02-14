import { User } from '../Models/User'

export class Utils {
    public static getUserResponse(user: User) {
        return {
            _id: user._id,
            name: user.name,
            lastName: user.lastName,
            userName: user.userName,
            criptoCoins: user.criptoCoins,
            preferredCurrency: user.preferredCurrency,
        }
    }
}
