import { Router } from 'express'
import { addCompany, updateCompany, deleteCompany, getCompany, searchCompanyByName } from '../controller/company.controller.js'
import { auth, authorize } from '../middlewares/auth.js'
import { validate } from '../middlewares/validate.js'
import { companySchema } from '../validation/schemas.js'

const  companyRouter = Router()


companyRouter.post('/add', auth, authorize('Company_HR'), validate(companySchema), addCompany)
companyRouter.put('/update/:id', auth, authorize('Company_HR'), updateCompany)
companyRouter.delete('/delete/:id', auth, authorize('Company_HR'), deleteCompany)
companyRouter.get('/get/:id', auth, authorize('Company_HR'), getCompany)
companyRouter.get('/search', auth, authorize('Company_HR', 'User'), searchCompanyByName)

export default companyRouter
