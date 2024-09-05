import { Router } from 'express'
import { getApplicationsForJob, generateApplicationsReport } from '../controller/application.controller.js'
import { auth, authorize } from '../middlewares/auth.js'

const applicantRouter = Router()

applicantRouter.get('/job/:id/applications', auth, authorize('Company_HR'), getApplicationsForJob)
applicantRouter.get('/report', auth, authorize('Company_HR'), generateApplicationsReport)

export default  applicantRouter
