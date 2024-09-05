
import express from 'express'
import userRouter from './routes/user.routes.js'
import companyRouter from './routes/company.routes.js'
import applicationRouter from './routes/application.routes.js'
import dotenv from 'dotenv';
import jobRouter from './routes/job.routes.js'

// Connect to MongoDB 
import {connectDB} from './database/dbCon.js'

dotenv.config()
const app = express()
app.use(express.json())

// Routes 
app.use('/user', userRouter)
app.use('/company', companyRouter)
app.use('/application', applicationRouter)
app.use('/job',jobRouter)

// Start server
app.listen(3000, () =>{
    console.log('Srever running...........')
})