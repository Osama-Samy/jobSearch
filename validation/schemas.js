import Joi from 'joi'
export const userSchema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    recoveryEmail: Joi.string().email().optional(),
    DOB: Joi.date().required(),
    mobileNumber: Joi.string().required(),
    role: Joi.string().valid('User', 'Company_HR').required()
})

export const signinSchema = Joi.object({
    email: Joi.string().email().optional(),
    mobileNumber: Joi.string().optional(),
    password: Joi.string().required()
})

export const companySchema = Joi.object({
    companyName: Joi.string().required(),
    description: Joi.string().required(),
    industry: Joi.string().required(),
    address: Joi.string().required(),
    numberOfEmployees: Joi.string().valid('1-10', '11-20', '21-50', '51-100', '101-200', '201-500', '501-1000', '1001-5000', '5001-10000', '10000+').required(),
    companyEmail: Joi.string().email().required()
})

export const jobSchema = Joi.object({
    jobTitle: Joi.string().required(),
    jobLocation: Joi.string().valid('onsite', 'remotely', 'hybrid').required(),
    workingTime: Joi.string().valid('part-time', 'full-time').required(),
    seniorityLevel: Joi.string().valid('Junior', 'Mid-Level', 'Senior', 'Team-Lead', 'CTO').required(),
    jobDescription: Joi.string().required(),
    technicalSkills: Joi.array().items(Joi.string()).required(),
    softSkills: Joi.array().items(Joi.string()).required(),
    company: Joi.string().required()
})

export const applicationSchema = Joi.object({
    jobId: Joi.string().required(),
    resume: Joi.string().required(),
    coverLetter: Joi.string().required()
})
