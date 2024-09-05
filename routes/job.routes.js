import { Router } from 'express'
import { auth, authorize } from '../middlewares/auth.js'
import { addJob, updateJob, deleteJob, getAllJobsWithCompanyInfo, getJobsForCompany, getJobsWithFilters, applyToJob } from '../controller/job.controller.js'
import { validate } from '../middlewares/validate.js'
import { jobSchema, applicationSchema } from '../validation/schemas.js'

const  jobRouter = Router()

jobRouter.post('/add', auth, authorize('Company_HR'), validate(jobSchema), addJob)
jobRouter.put('/update/:id', auth, authorize('Company_HR'), updateJob)
jobRouter.delete('/delete/:id', auth, authorize('Company_HR'), deleteJob)
jobRouter.get('/all', auth, authorize('User', 'Company_HR'), getAllJobsWithCompanyInfo)
jobRouter.get('/company', auth, authorize('User', 'Company_HR'), getJobsForCompany)
jobRouter.get('/filters', auth, authorize('User', 'Company_HR'), getJobsWithFilters)
jobRouter.post('/apply', auth, authorize('User'), validate(applicationSchema), applyToJob)

export default jobRouter