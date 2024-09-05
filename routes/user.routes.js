import express from 'express'
import { signup, signin, updateAccount, deleteAccount, getAccountData, getProfileData, updatePassword } from '../controller/user.controller.js'
import { auth } from '../middlewares/auth.js'
import { validate } from '../middlewares/validate.js'
import { userSchema, signinSchema } from '../validation/schemas.js'

const userRouter= express.Router()
userRouter.post('/signup', validate(userSchema), signup)
userRouter.post('/signin', validate(signinSchema), signin)
userRouter.put('/account/:id', auth, updateAccount)
userRouter.delete('/account/:id', auth, deleteAccount)
userRouter.get('/account/:id', auth, getAccountData)
userRouter.get('/profile/:id', getProfileData)
userRouter.put('/account/password/:id', auth, updatePassword)

export default userRouter
