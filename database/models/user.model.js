import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import moment from 'moment'

const { Schema, model } = mongoose

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    username: {
        type: String,
        unique: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    recoveryEmail: {
        type: String
    },
    DOB: {
        type: Date,
        required: true,
        validate: {
            validator: function (value) {
                return moment(value, 'YYYY-MM-DD', true).isValid();
            },
            message: 'Date of Birth must be in format YYYY-MM-DD'
        }
    },
    mobileNumber: {
        type: String,
        unique: true,
        required: true
    },
    role: {
        type: String,
        enum: ['User', 'Company_HR'],
        required: true
    },
    status: {
        type: String,
        enum: ['online', 'offline'],
        default: 'offline'
    },
    sessions: [{
        token: {
            type: String,
            required: true
        }
    }]
})

userSchema.pre('save', async function (next) {
    const user = this;

    user.username = `${user.firstName}${user.lastName}`

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})

export const User = mongoose.model('User', userSchema)