import { Company } from '../database/models/company.model.js'
import { Job } from '../database/models/job.model.js'

const addCompany = async (req, res) => {
    const { companyName, description, industry, address, numberOfEmployees, companyEmail } = req.body

    try {
        const company = new Company({
            companyName,
            description,
            industry,
            address,
            numberOfEmployees,
            companyEmail,
            companyHR: req.user._id
        })
        await company.save()

        res.status(201).json({ message: 'Company added successfully', company })
    } catch (error) {
        console.error(error.message)
        res.status(500).send('Server error')
    }
}

const updateCompany = async (req, res) => {
    const companyId = req.params.id
    const { companyName, description, industry, address, numberOfEmployees, companyEmail } = req.body

    try {
        const company = await Company.findById(companyId);
        if (!company) {
            return res.status(404).json({ message: 'Company not found' });
        }

        if (company.companyHR.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this company' })
        }

        if (companyName) company.companyName = companyName
        if (description) company.description = description
        if (industry) company.industry = industry
        if (address) company.address = address
        if (numberOfEmployees) company.numberOfEmployees = numberOfEmployees
        if (companyEmail) company.companyEmail = companyEmail

        await company.save()

        res.json({ message: 'Company updated successfully', company })
    } catch (error) {
        console.error(error.message)
        res.status(500).send('Server error')
    }
}

const deleteCompany = async (req, res) => {
    const companyId = req.params.id

    try {
        const company = await Company.findById(companyId)

        if (!company) {
            return res.status(404).json({ msg: 'Company not found' })
        }
        if (company.companyHR.toString() !== req.user._id.toString()) {
            return res.status(403).json({ msg: 'Not authorized to delete this company' })
        }

        await Company.findByIdAndDelete(companyId);

        res.json({ msg: 'Company deleted successfully' })
    } catch (error) {
        console.error(error.message)
        res.status(500).send('Server error')
    }
}

const getCompany = async (req, res) => {
    const companyId = req.params.id

    try {
        const company = await Company.findById(companyId).populate('companyHR')
        if (!company) {
            return res.status(404).json({ msg: 'Company not found' })
        }

        const jobs = await Job.find({ company: companyId })

        res.json({ company, jobs })
    } catch (error) {
        console.error(error.message)
        res.status(500).send('Server error')
    }
}

const searchCompanyByName = async (req, res) => {
    const { name } = req.query

    try {
        const companies = await Company.find({ companyName: new RegExp(name, 'i') })

        res.json({ companies })
    } catch (error) {
        console.error(error.message)
        res.status(500).send('Server error')
    }
}

export { 
    addCompany,
    updateCompany,
    deleteCompany,
    getCompany,
    searchCompanyByName
};
