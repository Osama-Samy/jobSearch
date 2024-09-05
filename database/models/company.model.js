import mongoose from 'mongoose'
const { Schema, model } = mongoose

const companySchema = new Schema({
    companyName: {
        type: String,
        unique: true,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    industry: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    numberOfEmployees: {
        type: String,
        enum: ['1-10', '11-20', '21-50', '51-100', '101-200', '201-500', '501-1000', '1001-5000', '5001-10000', '10000+'],
        required: true
    },
    companyEmail: {
        type: String,
        unique: true,
        required: true
    },
    companyHR: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
})

export const Company = model('Company', companySchema)
