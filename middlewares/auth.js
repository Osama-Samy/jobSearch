import { User } from '../database/models/user.model.js'

export const auth = async (req, res, next) => {
    const { userId } = req.body

    if (!userId) {
        return res.status(401).json({ msg: 'No authentication token, authorization denied' })
    }

    try {
        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({ msg: 'User not found' })
        }

        req.user = user
        next()
    } catch (error) {
        console.error(error.message)
        res.status(500).send('Server error')
    }
}

export const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Forbidden: You do not have the necessary permissions' })
        }
        next()
    }
}
