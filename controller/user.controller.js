import { User } from '../database/models/user.model.js'
import crypto from 'crypto'
import bcrypt from 'bcryptjs'

const generateToken = () => {
    return crypto.randomBytes(16).toString('hex')
}

const signup = async (req, res) => {
    const { firstName, lastName, email, password, recoveryEmail, DOB, mobileNumber, role } = req.body

    try {
        const user = new User({ firstName, lastName, email, password, recoveryEmail, DOB, mobileNumber, role })
        await user.save()

        res.status(201).json({ message: 'User registered successfully', user })
    } catch (error) {
        console.error(error.message)
        res.status(500).send('Server error')
    }
}

const signin = async (req, res) => {
    const { email, password } = req.body

    try {
        const user = await User.findOne({ email })

        if (!user || !await bcrypt.compare(password, user.password)) {
            return res.status(400).json({ message: 'Invalid email or password' })
        }

        const token = generateToken()
        user.sessions = user.sessions.concat({ token })
        await user.save();

        res.json({ message: 'Sign in successful', token })
    } catch (error) {
        console.error(error.message)
        res.status(500).send('Server error')
    }
}

const updateAccount = async (req, res) => {
    const userId = req.params.id
    const { email, mobileNumber, recoveryEmail, DOB, firstName, lastName } = req.body

    try {
        if (req.user._id.toString() !== userId) {
            return res.status(403).json({ msg: 'Not authorized' })
        }
        if (email && email !== req.user.email) {
            let existingUser = await User.findOne({ email })
            if (existingUser) {
                return res.status(400).json({ msg: 'Email already in use' })
            }
            req.user.email = email
        }
        if (mobileNumber && mobileNumber !== req.user.mobileNumber) {
            let existingUser = await User.findOne({ mobileNumber })
            if (existingUser) {
                return res.status(400).json({ message: 'Mobile number already in use' })
            }
            req.user.mobileNumber = mobileNumber
        }

        if (recoveryEmail) req.user.recoveryEmail = recoveryEmail
        if (DOB) req.user.DOB = DOB
        if (firstName) req.user.firstName = firstName
        if (lastName) req.user.lastName = lastName

        await req.user.save()

        res.json({ message: 'Account updated successfully', user: req.user })
    } catch (error) {
        console.error(error.message)
        res.status(500).send('Server error')
    }
}

const deleteAccount = async (req, res) => {
    const userId = req.params.id

    try {
        if (req.user._id.toString() !== userId) {
            return res.status(403).json({ message: 'Not authorized' })
        }

        await User.findByIdAndDelete(userId);

        res.json({ message: 'Account deleted successfully' })
    } catch (error) {
        console.error(error.message)
        res.status(500).send('Server error')
    }
}

const getAccountData = async (req, res) => {
    const userId = req.params.id

    try {
        if (req.user._id.toString() !== userId) {
            return res.status(403).json({ message: 'Not authorized' })
        }

        const user = await User.findById(userId)

        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }

        res.json({ user })
    } catch (error) {
        console.error(error.message)
        res.status(500).send('Server error')
    }
}

const getProfileData = async (req, res) => {
    const userId = req.params.id || req.query.id

    try {
        const user = await User.findById(userId)

        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }

        res.json({ user })
    } catch (error) {
        console.error(error.message)
        res.status(500).send('Server error')
    }
}

const updatePassword = async (req, res) => {
    const userId = req.params.id
    const { oldPassword, newPassword } = req.body

    try {
        if (req.user._id.toString() !== userId) {
            return res.status(403).json({ message: 'Not authorized' })
        }

        if (oldPassword !== req.user.password) {
            return res.status(400).json({ message: 'Old password is incorrect' })
        }

        req.user.password = newPassword
        await req.user.save()

        res.json({ message: 'Password updated successfully' })
    } catch (error) {
        console.error(error.message)
        res.status(500).send('Server error')
    }
}

export { 
    signup,
    signin,
    updateAccount,
    deleteAccount,
    getAccountData,
    getProfileData,
    updatePassword
}
